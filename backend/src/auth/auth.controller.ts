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

    @Post('forgot-password')
    forgotPassword(@Body() body: { email: string; }) {
        return this.authService.sendResetEmail(body.email);
    }

    @Post('reset-password')
    resetPassword(@Body() body: { token: string, newPassword: string }) {
        return this.authService.resetPassword(body.token, body.newPassword)
    }


    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: { user: JwtPayload }) {
        return req.user;
    }
}
