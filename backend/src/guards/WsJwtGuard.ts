import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const client: Socket = context.switchToWs().getClient<Socket>();
        const token = client.handshake.query.token as string;

        if (!token) return false;

        try {
            const payload = this.jwtService.verify(token);
            client.data.user = { id: payload.sub, username: payload.username };
            return true;
        } catch (err) {
            return false;
        }
    }
}
