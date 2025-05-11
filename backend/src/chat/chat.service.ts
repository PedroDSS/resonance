import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async saveMessage(data: { userId: number; message: string; timestamp: Date }) {
        const user = await this.userRepository.findOne({ where: { id: data.userId } });

        if (!user) {
            throw new Error('User not found');
        }
        const newMessage = this.messageRepository.create({
            message: data.message,
            timestamp: data.timestamp,
            sender: user,
        });

        await this.messageRepository.save(newMessage);
        return newMessage;
    }

    async getMessageHistory() {
        return this.messageRepository.find({
            order: { timestamp: 'ASC' },
            relations: ['sender'],
        });
    }
}
