import { Injectable, NotFoundException } from '@nestjs/common';
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

    async findById(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { email } });
    }

    create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepo.create(user);
        return this.userRepo.save(newUser);
    }

    async updateProfile(id: number, data: Partial<User>): Promise<User> {
        await this.userRepo.update(id, data);
        const user = await this.userRepo.findOneBy({ id });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async findByResetToken(token: string): Promise<User | null> {
        return this.userRepo.findOne({
            where: { resetToken: token },
        });
    }

    async save(user: User): Promise<User> {
        return this.userRepo.save(user);
    }
}
