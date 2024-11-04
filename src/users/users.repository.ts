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

    async findByRole(role: string): Promise<User[]> {
        return this.userRepository.find({ where: { role } });
    }

    async findOne(email: string): Promise<User> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(email: string, password: string, name: string) {
        const user = new User();
        user.email = email;
        user.password = password;
        user.name = name;
        return this.userRepository.save(user);
    }

    async update(email: string, password?: string, role?: string) {
        const updateData: Partial<User> = {};

        if (password) updateData.password = password;
        if (role) updateData.role = role;

        return this.userRepository.update({ email }, updateData);
        
    }

    async delete(email: string) {
        const user = await this.userRepository.findOne({ where: { email } });
        return this.userRepository.remove(user);
    }

}
