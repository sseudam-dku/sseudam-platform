import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomUUID } from "crypto";
import { OAuth2Client } from "google-auth-library";
import { QueryResultRow } from "pg";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import { DatabaseService } from "../database.service";
import { JwtPayload } from "./models/jwt-payload.interface";

interface UserRow extends QueryResultRow {
  id: string;
  email: string;
  nickname: string | null;
  google_id: string | null;
  avatar_url: string | null;
  city: string | null;
  district: string | null;
}

interface GoogleTokenPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

export interface AuthLoginResult {
  accessToken: string;
  user: AuthenticatedUser;
}

/**
 * Handles Google OAuth verification, JWT issuance, and session management.
 */
@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;
  private readonly jwtExpiresInSeconds = 60 * 60 * 24 * 7;

  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.googleClientId = configService.getOrThrow<string>("GOOGLE_CLIENT_ID");
    this.googleClient = new OAuth2Client(this.googleClientId);
  }

  async loginWithGoogle(idToken: string): Promise<AuthLoginResult> {
    const payload = await this.verifyGoogleToken(idToken);
    const user = await this.findOrCreateUser(payload);
    const sessionId = await this.createSession(user.id);
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        sessionId,
      } satisfies JwtPayload,
      { expiresIn: this.jwtExpiresInSeconds },
    );
    return { accessToken, user: this.mapUser(user) };
  }

  async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return this.mapUser(user);
  }

  async logout(sessionId: string): Promise<void> {
    await this.database.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
  }

  async validateSession(payload: JwtPayload): Promise<AuthenticatedUser | null> {
    const { rows } = await this.database.query<{ expires_at: Date }>(
      "SELECT expires_at FROM sessions WHERE id = $1 AND user_id = $2",
      [payload.sessionId, payload.sub],
    );
    if (rows.length === 0) {
      return null;
    }
    if (rows[0].expires_at < new Date()) {
      await this.database.query("DELETE FROM sessions WHERE id = $1", [payload.sessionId]);
      return null;
    }
    const user = await this.findUserById(payload.sub);
    if (!user) {
      return null;
    }
    return this.mapUser(user);
  }

  private async verifyGoogleToken(idToken: string): Promise<GoogleTokenPayload> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.googleClientId,
      });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) {
        throw new UnauthorizedException("Invalid Google token payload");
      }
      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
    } catch {
      throw new UnauthorizedException("Invalid Google token");
    }
  }

  private async findOrCreateUser(payload: GoogleTokenPayload): Promise<UserRow> {
    const existing = await this.database.query<UserRow>(
      "SELECT id, email, nickname, google_id, avatar_url, city, district FROM users WHERE google_id = $1",
      [payload.sub],
    );
    if (existing.rows[0]) {
      return existing.rows[0];
    }
    const { rows } = await this.database.query<UserRow>(
      `INSERT INTO users (id, email, nickname, google_id, avatar_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, nickname, google_id, avatar_url, city, district`,
      [randomUUID(), payload.email, payload.name ?? null, payload.sub, payload.picture ?? null],
    );
    return rows[0];
  }

  private async findUserById(userId: string): Promise<UserRow | null> {
    const { rows } = await this.database.query<UserRow>(
      "SELECT id, email, nickname, google_id, avatar_url, city, district FROM users WHERE id = $1",
      [userId],
    );
    return rows[0] ?? null;
  }

  private async createSession(userId: string): Promise<string> {
    const sessionId = randomUUID();
    const tokenHash = createHash("sha256").update(sessionId).digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await this.database.query(
      "INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
      [sessionId, userId, tokenHash, expiresAt],
    );
    return sessionId;
  }

  private mapUser(user: UserRow): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatarUrl: user.avatar_url,
      city: user.city,
      district: user.district,
    };
  }
}
