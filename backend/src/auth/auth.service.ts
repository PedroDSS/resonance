import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { addMinutes } from 'date-fns';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService
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

    async sendResetEmail(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) throw new BadRequestException("Cet email n'est associé à aucun compte.");

        const token = crypto.randomBytes(32).toString('hex');
        user.resetToken = token;
        user.resetTokenExpires = addMinutes(new Date(), 15);
        await this.userService.save(user);

        const resetLink = `http://localhost:5173/reset-password?token=${token}`;
        await this.mailerService.sendMail({
            to: email,
            subject: 'Réinitialisation de mot de passe',
            html: `<p>Cliquez ici pour réinitialiser votre mot de passe : <a href="${resetLink}">${resetLink}</a></p>`,
        });

        return { message: 'Email envoyé si l’adresse existe.' };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.userService.findByResetToken(token);

        if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            throw new BadRequestException('Token invalide ou expiré');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        user.resetTokenExpires = null;

        await this.userService.save(user);
        return { message: 'Mot de passe mis à jour avec succès.' };
    }

}
