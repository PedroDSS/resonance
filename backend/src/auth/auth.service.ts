import { Injectable, UnauthorizedException } from '@nestjs/common';
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
        const hashed = await bcrypt.hash(password, 10);
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        return this.userService.create({ username, password: hashed, color: randomColor });
    }

    async login(username: string, password: string) {
        const user = await this.userService.findByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, username: user.username };
        return {
            access_token: this.jwtService.sign(payload),
            user: { id: user.id, username: user.username, color: user.color },
        };
    }
}
