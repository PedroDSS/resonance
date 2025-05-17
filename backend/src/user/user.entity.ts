import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from '../chat/message.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column()
    color: string;

    @Column({ nullable: true })
    avatar: string;

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    @Column({ type: 'text', nullable: true })
    resetToken: string | null;

    @Column({ type: 'datetime', nullable: true })
    resetTokenExpires: Date | null;
}