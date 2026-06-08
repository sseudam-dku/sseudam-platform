export enum ChatGuardrailViolation {
  JAILBREAK = "jailbreak",
  PROMPT_INJECTION = "prompt_injection",
  UNSAFE_CONTENT = "unsafe_content",
  OUTPUT_LEAK = "output_leak",
}

export interface ChatInputGuardResult {
  allowed: boolean;
  violation?: ChatGuardrailViolation;
}

const JAILBREAK_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions?|rules?|prompts?)/i,
  /forget\s+(all\s+)?(your\s+)?(instructions?|rules?|prompts?)/i,
  /you\s+are\s+now\s+/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /\bDAN\b/i,
  /\bjailbreak\b/i,
  /developer\s+mode/i,
  /(show|reveal|print|repeat|display)\s+(your\s+)?(system\s+)?(prompt|instructions?|rules?)/i,
  /what\s+(are|is)\s+your\s+(system\s+)?(prompt|instructions?)/i,
  /(이전|위|기존)\s*(지시|명령|규칙|프롬프트).*(무시|잊|벗어나)/,
  /(시스템\s*프롬프트|시스템프롬프트|지시문|숨겨진\s*규칙).*(알려|보여|출력|반복|공개)/,
  /(이제부터|앞으로)\s*너는\s+/,
  /(탈옥|jailbreak|dan\s*모드|개발자\s*모드)/i,
  /새로운\s*(지시|명령|역할)/,
  /역할\s*(을|를)?\s*(바꿔|변경|전환)/,
];

const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /^\s*system\s*:/im,
  /^\s*assistant\s*:/im,
  /^\s*user\s*:/im,
  /\[system\]/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /<\|system\|>/i,
  /###\s*(system|instruction|human|assistant)\b/i,
  /override\s+(the\s+)?(system\s+)?(instructions?|rules?|prompt)/i,
  /(override|overwrite)\s+(instructions?|rules?)/i,
  /role\s*:\s*(system|assistant|developer)/i,
];

const UNSAFE_CONTENT_PATTERNS: RegExp[] = [
  /\b(hack|exploit|malware|ransomware)\b/i,
  /(폭탄|무기|해킹|악성코드).*(만들|제조|방법)/,
];

const OUTPUT_LEAK_MARKERS: RegExp[] = [
  /너는\s+쓰담\(Sseudam\)\s+앱의\s+분리수거\s+도우미다/,
  /##\s*페르소나·톤/,
  /##\s*분류\s*체계/,
  /WASTE_TYPE_GUIDE/,
  /NON_RECYCLABLE:\s*일반쓰레기/,
  /User region:/i,
  /##\s*사용자\s*지역/,
];

const PII_PATTERNS: RegExp[] = [
  /\b\d{3}-\d{3,4}-\d{4}\b/,
  /\b\d{6}-\d{7}\b/,
  /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
];

export const CHAT_INPUT_REFUSAL_MESSAGE =
  "죄송해요, 분리수거 관련 질문만 도와드릴 수 있어요. 배출 방법이나 분류가 궁금하시면 편하게 물어봐 주세요.";

export const CHAT_OUTPUT_REFUSAL_MESSAGE =
  "죄송해요, 답변을 안전하게 제공하지 못했어요. 분리수거에 대해 다시 질문해 주세요.";

function matchesAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(text));
}

/**
 * Input rail: blocks jailbreak, prompt injection, and unsafe requests before LLM inference.
 */
export function validateChatInput(message: string): ChatInputGuardResult {
  const normalized = message.trim();
  if (!normalized) {
    return { allowed: false, violation: ChatGuardrailViolation.PROMPT_INJECTION };
  }
  if (matchesAnyPattern(normalized, JAILBREAK_PATTERNS)) {
    return { allowed: false, violation: ChatGuardrailViolation.JAILBREAK };
  }
  if (matchesAnyPattern(normalized, PROMPT_INJECTION_PATTERNS)) {
    return { allowed: false, violation: ChatGuardrailViolation.PROMPT_INJECTION };
  }
  if (matchesAnyPattern(normalized, UNSAFE_CONTENT_PATTERNS)) {
    return { allowed: false, violation: ChatGuardrailViolation.UNSAFE_CONTENT };
  }
  return { allowed: true };
}

/**
 * Validates all user-authored messages in a conversation history payload.
 */
export function validateChatHistory(
  history: { role: string; content: string }[],
): ChatInputGuardResult {
  for (const item of history) {
    if (item.role !== "user") {
      continue;
    }
    const result = validateChatInput(item.content);
    if (!result.allowed) {
      return result;
    }
  }
  return { allowed: true };
}

/**
 * Output rail: redacts leaked system instructions, PII, and unsafe model drift.
 */
export function sanitizeChatOutput(content: string): string {
  const trimmed = content.trim();
  if (!trimmed) {
    return CHAT_OUTPUT_REFUSAL_MESSAGE;
  }
  if (matchesAnyPattern(trimmed, OUTPUT_LEAK_MARKERS)) {
    return CHAT_OUTPUT_REFUSAL_MESSAGE;
  }
  if (matchesAnyPattern(trimmed, JAILBREAK_PATTERNS)) {
    return CHAT_OUTPUT_REFUSAL_MESSAGE;
  }
  if (matchesAnyPattern(trimmed, PII_PATTERNS)) {
    return CHAT_OUTPUT_REFUSAL_MESSAGE;
  }
  return trimmed;
}
