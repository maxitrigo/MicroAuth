import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private mailService: MailService,
        private usersRepository: UsersRepository
    ) {}

    async register(email: string, password: string) {
        const existingUser = await this.usersRepository.findOne(email);
        
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersRepository.create(email, hashedPassword)
        const newUser = await this.usersRepository.findOne(email)
        const token = this.jwtService.sign({id: newUser.id, email: newUser.email, role: newUser.role }, { expiresIn: '1h' });

        return { token };
    }

    async login(email: string, password: string) {
        const user = await this.usersRepository.findOne(email);
        if (user && ( await bcrypt.compare(password, user.password))) {
            const token = this.jwtService.sign({id: user.id, email, role: user.role }, { expiresIn: '1h' });
            return { token };
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async changePassword(token: string, currentPassword: string, newPassword: string) {
        if(!token || !currentPassword || !newPassword) throw new UnauthorizedException('Invalid credentials');
        const decoded = this.jwtService.verify(token);
        const { email } = decoded;
        const user = await this.usersRepository.findOne(email);
        if (user && (await bcrypt.compare(currentPassword, user.password))) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.usersRepository.changePassword(email, hashedPassword);
            return { message: 'Password changed successfully' };
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async requestPasswordReset(email: string) {
        const user = await this.usersRepository.findOne(email);
        
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const payload = { email: user.email };
        const resetToken = this.jwtService.sign(payload, { expiresIn: '1h' });

        await this.mailService.sendResetEmail(user.email, resetToken);

        return { message: 'Password reset email sent' };
    }

    async resetPassword(resetToken: string, newPassword: string) {
        try{
            const decoded = this.jwtService.verify(resetToken);
            const { email } = decoded;
            const user = await this.usersRepository.findOne(email);
            if (!user) {
                throw new Error ('User not found');
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await this.usersRepository.changePassword(email, hashedPassword);
            return { message: 'Password reset successfully' };
        } catch (error) {
            throw new UnauthorizedException ('Invalid reset token');
        }
    }

    async deleteUser(targetUserEmail: string, token: string) {
        const decoded = this.jwtService.verify(token)
        const { email: userEmail, role: userRole } = decoded

        const targetUser = await this.usersRepository.findOne(targetUserEmail)
        if(!targetUser) throw new NotFoundException('User not found')

            // check if user is admin or the target user is the same as the logged in user
        if (userRole === 'admin' || userEmail === targetUserEmail) {
            await this.usersRepository.delete(targetUserEmail)
            return { message: `Usuario ${targetUserEmail} eliminado con éxito.` };
        }
        
        throw new UnauthorizedException('No tienes permisos para eliminar esta cuenta.');
    }
}
