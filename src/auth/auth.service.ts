import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, TokenExpiredError, JsonWebTokenError } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export type RefreshTokenDocument = {
  _id: string;
  userId: Number,
  refreshToken: String,
  createdAt: Date,
};

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel('RefreshToken') private refreshTokenModel: Model<RefreshTokenDocument>) {
  }

  accessTokenExpiredTTL: string = '5m'
  refreshTokenExpiredTTL: string = '7d'

  async makeJwtToken(user: { id: string; email: string }) {
    const roles = ['guest'];
    const userDto = {
      userId: user.id,
      email: user.email,
      roles: roles
    }
    
    const accessToken = await this.makeJweToken(userDto, this.accessTokenExpiredTTL);
    const refreshToken = await this.makeJweToken(userDto, this.refreshTokenExpiredTTL);

    await this.refreshTokenModel.findOneAndUpdate(
      { userId: user.id },
      { refreshToken, createdAt: new Date() },
      { upsert: true }
    );

    return { accessToken, refreshToken };
  }

  async makeJweToken(user: { userId: string; email: string; roles: Array<string>;}, expriesIn: string) {
    const jwtPrivateKeyPath = this.configService.get('JWT_PRIVATE_KEY_PATH');
    const jweSecret = this.configService.get('JWE_SECRET');

    const privateKey = fs.readFileSync(jwtPrivateKeyPath, 'utf8');
    const secret = Buffer.from(jweSecret, 'base64');

    // 1. sign JWT (RS256)
    const jwtToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        roles: user.roles,
      },
      privateKey,
      {
        algorithm: 'RS256',
        expiresIn: expriesIn, //'1h',
      },
    );

    // 2. encrypt JWT (JWE)
    const jweToken = await new EncryptJWT({token: jwtToken})
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime(expriesIn) // '5m'
    .encrypt(secret);

    return jweToken;
  }

  async getJwtSecret() {
    return this.configService.get<string>('JWT_SECRET');
  }

  async refreshTokens(oldRefreshToken: string) {
    let verified: any;

    try {
      const jweToken = oldRefreshToken;
      const jweSecret = this.configService.get('JWE_SECRET');
      // 1. JWE 복호화
      const secret = Buffer.from(jweSecret, 'base64');
      const { payload } = await jwtDecrypt(jweToken, secret);
      console.log('payload : '+payload);
  
      const signedJwt = payload.token as string;
      console.log('signedJwt : '+signedJwt);
  
      // 2. JWS 서명 검증
      const jwtPublicKeyPath = this.configService.get('JWT_PUBLIC_KEY_PATH');
      const publicKey = fs.readFileSync(jwtPublicKeyPath, 'utf8');
      verified = jwt.verify(signedJwt, publicKey, { algorithms: ['RS256'], });
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      if (err instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw new UnauthorizedException('Refresh token error');
    }

    const tokenDoc = await this.refreshTokenModel.findOne({ userId: verified.sub });

    if (!tokenDoc || tokenDoc.refreshToken !== oldRefreshToken) {
      throw new UnauthorizedException('Refresh token mismatch or not found');
    }

    const userDto = {
      userId: verified.userId,
      email: verified.email,
      roles: verified.roles
    }

    const newAccessToken = await this.makeJweToken(userDto, this.accessTokenExpiredTTL);
    const newRefreshToken = await this.makeJweToken(userDto, this.refreshTokenExpiredTTL);

    tokenDoc.refreshToken = newRefreshToken;
    tokenDoc.createdAt = new Date();
    await tokenDoc.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

}
