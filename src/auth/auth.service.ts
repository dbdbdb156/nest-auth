import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { EncryptJWT } from 'jose';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService) {
  }

  async makeJwtToken(user: { id: number; email: string }) {
    const roles = ['guest'];

    const jwtPrivateKeyPath = this.configService.get('JWT_PRIVATE_KEY_PATH');
    const jweSecret = this.configService.get('JWE_SECRET');

    const privateKey = fs.readFileSync(jwtPrivateKeyPath, 'utf8');
    const secret = Buffer.from(jweSecret, 'base64');

    // 1. sign JWT (RS256)
    const jwtToken = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        roles: roles,
      },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn: '1h',
      },
    );

    // 2. encrypt JWT (JWE)
    const jweToken = await new EncryptJWT({token: jwtToken})
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('5m')
    .encrypt(secret);

    return { jweToken };
  }

  async getJwtSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }

}
