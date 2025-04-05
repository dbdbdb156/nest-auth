import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async makeJwtToken(@Body() req) {
    return await this.authService.makeJwtToken(req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('token')
  async getJwtToken(@Req() req) {
    const user = req.user;
    return user;
  }
}
