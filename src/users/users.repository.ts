import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(email: string, password: string) {
        const user = new User();
        user.email = email;
        user.password = password;
        return this.userRepository.save(user);
    }

    async changePassword(email: string, newPassword: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        user.password = newPassword;
        return this.userRepository.save(user);
    }

    async delete(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        return this.userRepository.remove(user);
    }

}
