import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JweJwtAuthGuard } from './guards/jwe-jwt.guard';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async makeJwtToken(@Body() req, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } =  await this.authService.makeJwtToken(req);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return { accessToken, refreshToken };
  }

  @UseGuards(JweJwtAuthGuard)
  @Get('token')
  async getJwtToken(@Req() req) {
    const user = req.user;
    return user;
  }

  /**
   * Refresh Token 재발급
   */
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!oldRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken, refreshToken } = await this.authService.refreshTokens(oldRefreshToken);

    // 새 refreshToken 쿠키로 갱신 (선택사항)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return { accessToken };
  }

}
