import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'agro_secret_key_2026',
    });
  }

  async validate(payload: { sub: number; email: string; name: string }) {
    return {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}