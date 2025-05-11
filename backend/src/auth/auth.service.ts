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

    async register(username: string, password: string) {
        username = username.trim().toLowerCase();
        const displayName = username.trim().toUpperCase()

        if (username.length < 3) {
            throw new BadRequestException('Username must be at least 3 characters long');
        }

        if (password.length < 8) {
            throw new BadRequestException('Password must be at least 8 characters long');
        }

        const existingUser = await this.userService.findByUsername(username);
        if (existingUser) {
            throw new BadRequestException('Username is already taken');
        }

        const hashed = await bcrypt.hash(password, 10);
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

        return this.userService.create({ username, password: hashed, displayName, color: randomColor });
    }

    async login(username: string, password: string) {
        username = username.trim().toLowerCase();
        const user = await this.userService.findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                displayName: user.displayName,
                color: user.color
            },
        };
    }
}
