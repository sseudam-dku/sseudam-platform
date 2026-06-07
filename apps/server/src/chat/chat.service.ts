import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import { QueryResultRow } from "pg";
import { DatabaseService } from "../database.service";
import {
  CHAT_INPUT_REFUSAL_MESSAGE,
  sanitizeChatOutput,
  validateChatHistory,
  validateChatInput,
} from "./guardrails/chat-guardrails";
import { buildChatSystemPrompt } from "./prompts/system.prompt";

const GUEST_MESSAGE_LIMIT = 3;
const CHAT_TEMPERATURE = 0.45;
const CHAT_MAX_TOKENS = 400;

interface ChatHistoryItem {
  role: string;
  content: string;
}

interface SessionRow extends QueryResultRow {
  id: string;
  title: string | null;
  created_at: Date;
  updated_at: Date;
}

interface MessageRow extends QueryResultRow {
  id: string;
  role: string;
  content: string;
  created_at: Date;
}

export interface ChatMessageResponse {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface ChatSessionResponse {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageResult {
  sessionId: string;
  userMessage: ChatMessageResponse;
  assistantMessage: ChatMessageResponse;
}

export interface SendGuestMessageResult {
  assistantMessage: ChatMessageResponse;
  remainingCount: number;
}

/**
 * Manages AI chat sessions and OpenAI-powered responses.
 */
@Injectable()
export class ChatService {
  private readonly openai: OpenAI | null;

  constructor(
    private readonly database: DatabaseService,
    configService: ConfigService,
  ) {
    const apiKey = configService.get<string>("OPENAI_API_KEY");
    this.openai = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async sendMessage(
    userId: string,
    message: string,
    sessionId: string | undefined,
    city: string,
    district: string,
  ): Promise<SendMessageResult> {
    if (!this.openai) {
      throw new ServiceUnavailableException("OpenAI API key is not configured");
    }
    const inputGuard = validateChatInput(message);
    if (!inputGuard.allowed) {
      return this.buildBlockedMessageResult(message, sessionId);
    }
    const activeSessionId = sessionId ?? (await this.createSession(userId, message));
    if (sessionId) {
      await this.ensureSessionOwnership(userId, sessionId);
    }
    const userMessage = await this.saveMessage(activeSessionId, "user", message);
    const history = await this.getRecentMessages(activeSessionId);
    const assistantContent = await this.generateAssistantReply(history, city, district);
    const assistantMessage = await this.saveMessage(activeSessionId, "assistant", assistantContent);
    await this.database.query("UPDATE chat_sessions SET updated_at = NOW() WHERE id = $1", [
      activeSessionId,
    ]);
    return {
      sessionId: activeSessionId,
      userMessage: this.mapMessage(userMessage),
      assistantMessage: this.mapMessage(assistantMessage),
    };
  }

  async sendGuestMessage(
    guestSessionId: string,
    message: string,
    city: string,
    district: string,
    history: ChatHistoryItem[],
  ): Promise<SendGuestMessageResult> {
    if (!this.openai) {
      throw new ServiceUnavailableException("OpenAI API key is not configured");
    }
    const inputGuard = validateChatInput(message);
    const historyGuard = validateChatHistory(history);
    if (!inputGuard.allowed || !historyGuard.allowed) {
      const currentCount = await this.getGuestMessageCount(guestSessionId);
      return {
        assistantMessage: this.createEphemeralAssistantMessage(CHAT_INPUT_REFUSAL_MESSAGE),
        remainingCount: Math.max(0, GUEST_MESSAGE_LIMIT - currentCount),
      };
    }
    const currentCount = await this.getGuestMessageCount(guestSessionId);
    if (currentCount >= GUEST_MESSAGE_LIMIT) {
      throw new ForbiddenException(
        "비회원은 3회까지 이용 가능합니다. 로그인 후 계속 이용해 주세요.",
      );
    }
    const newCount = await this.incrementGuestMessageCount(guestSessionId);
    const conversationHistory: ChatHistoryItem[] = [...history, { role: "user", content: message }];
    const assistantContent = await this.generateAssistantReply(conversationHistory, city, district);
    return {
      assistantMessage: {
        id: randomUUID(),
        role: "assistant",
        content: assistantContent,
        createdAt: new Date().toISOString(),
      },
      remainingCount: Math.max(0, GUEST_MESSAGE_LIMIT - newCount),
    };
  }

  async findSessions(userId: string): Promise<ChatSessionResponse[]> {
    const { rows } = await this.database.query<SessionRow>(
      `SELECT id, title, created_at, updated_at
       FROM chat_sessions
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 50`,
      [userId],
    );
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    }));
  }

  async findSessionMessages(userId: string, sessionId: string): Promise<ChatMessageResponse[]> {
    await this.ensureSessionOwnership(userId, sessionId);
    const { rows } = await this.database.query<MessageRow>(
      `SELECT id, role, content, created_at
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at ASC`,
      [sessionId],
    );
    return rows.map(row => this.mapMessage(row));
  }

  private async createSession(userId: string, firstMessage: string): Promise<string> {
    const sessionId = randomUUID();
    const title = firstMessage.slice(0, 50);
    await this.database.query(
      "INSERT INTO chat_sessions (id, user_id, title) VALUES ($1, $2, $3)",
      [sessionId, userId, title],
    );
    return sessionId;
  }

  private async ensureSessionOwnership(userId: string, sessionId: string): Promise<void> {
    const { rows } = await this.database.query<{ id: string }>(
      "SELECT id FROM chat_sessions WHERE id = $1 AND user_id = $2",
      [sessionId, userId],
    );
    if (!rows[0]) {
      throw new NotFoundException("Chat session not found");
    }
  }

  private async saveMessage(
    sessionId: string,
    role: "user" | "assistant",
    content: string,
  ): Promise<MessageRow> {
    const { rows } = await this.database.query<MessageRow>(
      `INSERT INTO chat_messages (session_id, role, content)
       VALUES ($1, $2, $3)
       RETURNING id, role, content, created_at`,
      [sessionId, role, content],
    );
    return rows[0];
  }

  private async getRecentMessages(sessionId: string): Promise<MessageRow[]> {
    const { rows } = await this.database.query<MessageRow>(
      `SELECT id, role, content, created_at
       FROM chat_messages
       WHERE session_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [sessionId],
    );
    return rows.reverse();
  }

  private async getGuestMessageCount(guestSessionId: string): Promise<number> {
    const { rows } = await this.database.query<{ message_count: number }>(
      "SELECT message_count FROM guest_chat_usage WHERE guest_session_id = $1",
      [guestSessionId],
    );
    return rows[0]?.message_count ?? 0;
  }

  private async incrementGuestMessageCount(guestSessionId: string): Promise<number> {
    const { rows } = await this.database.query<{ message_count: number }>(
      `INSERT INTO guest_chat_usage (guest_session_id, message_count)
       VALUES ($1, 1)
       ON CONFLICT (guest_session_id)
       DO UPDATE SET
         message_count = guest_chat_usage.message_count + 1,
         updated_at = NOW()
       RETURNING message_count`,
      [guestSessionId],
    );
    return rows[0].message_count;
  }

  private async generateAssistantReply(
    history: ChatHistoryItem[],
    city: string,
    district: string,
  ): Promise<string> {
    const response = await this.openai!.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: buildChatSystemPrompt(city, district),
        },
        ...history.map(item => ({
          role: item.role as "user" | "assistant",
          content: item.content,
        })),
      ],
      temperature: CHAT_TEMPERATURE,
      max_tokens: CHAT_MAX_TOKENS,
    });
    const rawContent =
      response.choices[0]?.message?.content?.trim() ??
      "죄송해요, 답변을 생성하지 못했어요. 다시 시도해 주세요.";
    return sanitizeChatOutput(rawContent);
  }

  private createEphemeralAssistantMessage(content: string): ChatMessageResponse {
    return {
      id: randomUUID(),
      role: "assistant",
      content,
      createdAt: new Date().toISOString(),
    };
  }

  private async buildBlockedMessageResult(
    message: string,
    sessionId: string | undefined,
  ): Promise<SendMessageResult> {
    const activeSessionId = sessionId ?? randomUUID();
    return {
      sessionId: activeSessionId,
      userMessage: {
        id: randomUUID(),
        role: "user",
        content: message,
        createdAt: new Date().toISOString(),
      },
      assistantMessage: this.createEphemeralAssistantMessage(CHAT_INPUT_REFUSAL_MESSAGE),
    };
  }

  private mapMessage(row: MessageRow): ChatMessageResponse {
    return {
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content,
      createdAt: row.created_at.toISOString(),
    };
  }
}
