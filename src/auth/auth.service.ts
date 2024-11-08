import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from 'src/users/users.repository';
import { Roles } from 'src/users/roles.enum';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private mailService: MailService,
        private usersRepository: UsersRepository
    ) {}

    async getStaff() {
        return await this.usersRepository.findByRole(Roles.Staff);
    }

    async register(RegisterDto: RegisterDto) {
        const { email, password, name } = RegisterDto
        const existingUser = await this.usersRepository.findOne(email);
        
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await this.usersRepository.create(email, hashedPassword, name)
        const newUser = await this.usersRepository.findOne(email)
        const token = this.jwtService.sign({id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, { expiresIn: '1h' });

        return { token };
    }

    async login(email: string, password: string) {
        const user = await this.usersRepository.findOne(email);
        if (user && ( await bcrypt.compare(password, user.password))) {
            const token = this.jwtService.sign({id: user.id, email, role: user.role }, { expiresIn: '1h' });
            return { token: token, name: user.name, email: user.email, role: user.role };
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
            await this.usersRepository.update(email, hashedPassword);
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
            await this.usersRepository.update(email, hashedPassword, undefined);
            return { message: 'Password reset successfully' };
        } catch (error) {
            throw new UnauthorizedException ('Invalid reset token');
        }
    }

    async updateUserRole(token: string, email: string, role: string) {
        const decoded = this.jwtService.verify(token)
        const { role: userRole } = decoded

        const targetUser = await this.usersRepository.findOne(email)
        if(!targetUser) throw new NotFoundException('User not found')
        if(userRole !== Roles.Admin) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        await this.usersRepository.update(email, undefined, role)
        const updatedUser = await this.usersRepository.findOne(email)

        const newToken = this.jwtService.sign({id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role }, { expiresIn: '1h' });

        return { newToken }
    }

    async deleteUser(targetUserEmail: string, token: string) {
        const decoded = this.jwtService.verify(token)
        const { email: userEmail, role: userRole } = decoded

        const targetUser = await this.usersRepository.findOne(targetUserEmail)
        if(!targetUser) throw new NotFoundException('User not found')

            // check if user is admin or the target user is the same as the logged in user
        if (userRole === Roles.Admin || userEmail === targetUserEmail) {
            await this.usersRepository.delete(targetUserEmail)
            return { message: `Usuario ${targetUserEmail} eliminado con éxito.` };
        }
        
        throw new UnauthorizedException('No tienes permisos para eliminar esta cuenta.');
    }
}
