import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { UserModule } from '../user/user.module';
import { ChatService } from './chat.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message]),
        UserModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'the_secret_key_in_dev',
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
        }),
    ],
    providers: [ChatGateway, ChatService],
})
export class ChatModule { }
