import { Body, Controller, Delete, Headers, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('register')
    async register(@Body('email') email: string, @Body('password') password: string) {
        const token = await this.authService.register(email, password);
        return { login: "true", token: token.token }
    }

    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string) {
        const token = await this.authService.login(email, password);
        return { login: "true", token: token.token }
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard)
    async changePassword(@Body('email') email: string, @Body('currentPassword') currentPassword: string, @Body('newPassword') newPassword: string) {
        return this.authService.changePassword(email, currentPassword, newPassword);
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body('email') email: string) {
        console.log(email);
        
        return this.authService.requestPasswordReset(email);
    }

    @Post('reset-password')
    async resetPassword(
        @Param('resetToken') resetToken: string,
        @Body('newPassword') newPassword: string
    ){
        return this.authService.resetPassword(resetToken, newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    async deleteUser(
        @Body('email') targetUser: string,
        @Headers('authorization') authHeader: string
    ) {
        const token = authHeader.split(' ')[1];
        return this.authService.deleteUser(targetUser, token);
    }
}
