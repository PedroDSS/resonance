import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { Message } from './chat/message.entity';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/chat.sqlite',
      entities: [User, Message],
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'maildev',
        port: 1025,
      },
      defaults: {
        from: '"Resonance" <no-reply@resonance.com>',
      },
    }),
    UserModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
