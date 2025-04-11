import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtDecrypt } from 'jose';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { stringify } from 'querystring';
  
@Injectable()
export class JweJwtAuthGuard implements CanActivate {
constructor(private config: ConfigService) {}

async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('payload : '+stringify(request));

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Missing Bearer token');
    }

    const jweToken = authHeader.replace('Bearer ', '').trim();
    const jweSecret = this.config.get('JWE_SECRET');
    // 1. JWE 복호화
    const secret = Buffer.from(jweSecret, 'base64');
    const { payload } = await jwtDecrypt(jweToken, secret);
    console.log('payload : '+payload);

    const signedJwt = payload.token as string;
    console.log('signedJwt : '+signedJwt);

    // 2. JWS 서명 검증
    const jwtPublicKeyPath = this.config.get('JWT_PUBLIC_KEY_PATH');
    const publicKey = fs.readFileSync(jwtPublicKeyPath, 'utf8');
    const verified = jwt.verify(signedJwt, publicKey, { algorithms: ['RS256'], });

    console.log('verified : '+verified);

    // 3. 사용자 정보 주입
    request.user = verified;

    return true;
}
}