import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async register(email: string, password: string) {
        email = email.trim().toLowerCase();

        const rawUsername = email.split('@')[0];
        const username = rawUsername.charAt(0).toUpperCase() + rawUsername.slice(1).toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new BadRequestException('Email invalide');
        }

        if (password.length < 8) {
            throw new BadRequestException('Mot de passe trop court');
        }

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Email déjà utilisé');
        }

        const hashed = await bcrypt.hash(password, 10);
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

        return this.userService.create({ email, password: hashed, username, color: randomColor });
    }

    async login(email: string, password: string) {
        email = email.trim().toLowerCase();
        const user = await this.userService.findByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                color: user.color
            },
        };
    }
}
