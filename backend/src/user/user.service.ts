import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepo.find();
    }

    findByUsername(username: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { username } });
    }

    create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepo.create(user);
        return this.userRepo.save(newUser);
    }

    updateColor(id: number, color: string): Promise<User> {
        return this.userRepo.save({ id, color });
    }
}
