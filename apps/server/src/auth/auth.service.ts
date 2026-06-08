import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomUUID } from "crypto";
import { OAuth2Client } from "google-auth-library";
import { QueryResultRow } from "pg";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import { InMemoryCacheService } from "../core/cache/in-memory-cache.service";
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
  refreshToken: string;
  user: AuthenticatedUser;
}

export interface RefreshAccessTokenResult {
  accessToken: string;
}

/**
 * Handles Google OAuth verification, JWT issuance, and session management.
 */
@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client;
  private readonly googleClientId: string;
  private readonly jwtAccessExpiresInSeconds: number;
  private readonly sessionExpiresInDays = 7;
  private readonly sessionCacheTtlMs = 3 * 60 * 1000;

  constructor(
    private readonly database: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly cache: InMemoryCacheService,
    configService: ConfigService,
  ) {
    this.googleClientId = configService.getOrThrow<string>("GOOGLE_CLIENT_ID");
    this.googleClient = new OAuth2Client(this.googleClientId);
    this.jwtAccessExpiresInSeconds = configService.get<number>("JWT_ACCESS_EXPIRES_IN", 900);
  }

  async loginWithGoogle(idToken: string): Promise<AuthLoginResult> {
    const payload = await this.verifyGoogleToken(idToken);
    const user = await this.findOrCreateUser(payload);
    const { sessionId, refreshToken } = await this.createSession(user.id);
    const accessToken = await this.signAccessToken(user.id, user.email, sessionId);
    return { accessToken, refreshToken, user: this.mapUser(user) };
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshAccessTokenResult> {
    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
    const { rows } = await this.database.query<{
      id: string;
      user_id: string;
      expires_at: Date;
    }>("SELECT id, user_id, expires_at FROM sessions WHERE token_hash = $1", [tokenHash]);
    if (rows.length === 0) {
      throw new UnauthorizedException("Invalid refresh token");
    }
    const session = rows[0];
    if (session.expires_at < new Date()) {
      await this.database.query("DELETE FROM sessions WHERE id = $1", [session.id]);
      throw new UnauthorizedException("Refresh token expired");
    }
    const user = await this.findUserById(session.user_id);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    const accessToken = await this.signAccessToken(user.id, user.email, session.id);
    return { accessToken };
  }

  async getCurrentUser(userId: string): Promise<AuthenticatedUser> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }
    return this.mapUser(user);
  }

  async logout(sessionId: string): Promise<void> {
    this.cache.delete(this.buildSessionCacheKey(sessionId));
    await this.database.query("DELETE FROM sessions WHERE id = $1", [sessionId]);
  }

  async validateSession(payload: JwtPayload): Promise<AuthenticatedUser | null> {
    const cacheKey = this.buildSessionCacheKey(payload.sessionId);
    const cached = this.cache.get<AuthenticatedUser>(cacheKey);
    if (cached) {
      return cached;
    }
    const { rows } = await this.database.query<{ expires_at: Date }>(
      "SELECT expires_at FROM sessions WHERE id = $1 AND user_id = $2",
      [payload.sessionId, payload.sub],
    );
    if (rows.length === 0) {
      return null;
    }
    if (rows[0].expires_at < new Date()) {
      await this.database.query("DELETE FROM sessions WHERE id = $1", [payload.sessionId]);
      this.cache.delete(cacheKey);
      return null;
    }
    const user = await this.findUserById(payload.sub);
    if (!user) {
      return null;
    }
    const authenticatedUser = this.mapUser(user);
    this.cache.set(cacheKey, authenticatedUser, this.sessionCacheTtlMs, payload.sub);
    return authenticatedUser;
  }

  private buildSessionCacheKey(sessionId: string): string {
    return `session:${sessionId}`;
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

  private async createSession(
    userId: string,
  ): Promise<{ sessionId: string; refreshToken: string }> {
    const sessionId = randomUUID();
    const refreshToken = randomUUID();
    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.sessionExpiresInDays);
    await this.database.query(
      "INSERT INTO sessions (id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)",
      [sessionId, userId, tokenHash, expiresAt],
    );
    return { sessionId, refreshToken };
  }

  private async signAccessToken(userId: string, email: string, sessionId: string): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        email,
        sessionId,
      } satisfies JwtPayload,
      { expiresIn: this.jwtAccessExpiresInSeconds },
    );
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
