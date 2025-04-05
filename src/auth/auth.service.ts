import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService) {
  }

  async makeJwtToken(user: { id: number; email: string }) {
    const roles = ['guest'];
    const payload = { sub: user.id, email: user.email, roles: roles }
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user,
    }
  }

  async getJwtSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }

}
