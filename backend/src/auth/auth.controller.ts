import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from './jwt-payload.interface';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    register(@Body() body: { email: string; password: string }) {
        return this.authService.register(body.email, body.password);
    }

    @Post('login')
    login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: { user: JwtPayload }) {
        return req.user;
    }
}
