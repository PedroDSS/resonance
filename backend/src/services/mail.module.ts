import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'maildev',
                port: 1025,
                ignoreTLS: true,
            },
            defaults: {
                from: '"Resonance" <no-reply@resonance.local>',
            },
        }),
    ],
})
export class MailModule { }
