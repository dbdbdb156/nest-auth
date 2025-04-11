import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const jwtPublicKeyPath = config.get('JWT_PUBLIC_KEY_PATH');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Bearer token
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKey: fs.readFileSync(jwtPublicKeyPath, 'utf8'),
    });
  }

  async validate(payload: any) {
    // request.user에 저장될 값
    return {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };
  }
}