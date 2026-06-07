import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthenticatedUser } from "../core/models/authenticated-user.interface";
import { AuthService } from "./auth.service";
import { JwtPayload } from "./models/jwt-payload.interface";

interface RequestWithCookies extends Request {
  cookies: Record<string, string | undefined>;
}

/**
 * Validates JWT from Authorization header or access_token cookie.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: RequestWithCookies): string | null => {
          return request?.cookies?.access_token ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>("JWT_SECRET"),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.authService.validateSession(payload);
    if (!user) {
      throw new UnauthorizedException("Session expired or invalid");
    }
    return user;
  }
}
