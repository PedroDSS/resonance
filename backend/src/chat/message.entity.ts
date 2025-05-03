import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    username: string;

    @ManyToOne(() => User, user => user.messages)
    sender: User;

    @Column()
    timestamp: Date;
}
