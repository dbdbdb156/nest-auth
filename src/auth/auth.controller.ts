import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JweJwtAuthGuard } from './guards/jwe-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token')
  async makeJwtToken(@Body() req) {
    return await this.authService.makeJwtToken(req);
  }

  @UseGuards(JweJwtAuthGuard)
  @Get('token')
  async getJwtToken(@Req() req) {
    const user = req.user;
    return user;
  }

}
