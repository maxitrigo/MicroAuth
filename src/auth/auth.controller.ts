import { Body, Controller, Delete, Headers, Post, UseGuards } from '@nestjs/common';
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
    @UseGuards(JwtAuthGuard) // the token must be provided in the header, the same token you requested in the login or register (Authorization: Bearer <token>)
    async changePassword(@Headers('authorization') authHeader: string, @Body('currentPassword') currentPassword: string, @Body('newPassword') newPassword: string) {
        const token = authHeader.split(' ')[1];
        return this.authService.changePassword(token, currentPassword, newPassword);
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body('email') email: string) {
        return this.authService.requestPasswordReset(email);
    }

    @Post('reset-password')
    async resetPassword(
        @Body('resetToken') resetToken: string, // the same token you requested in the request-password-reset
        @Body('newPassword') newPassword: string
    ){
        return this.authService.resetPassword(resetToken, newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    async deleteUser(
        @Body('email') targetUser: string,
        @Headers('authorization') authHeader: string // the same token you requested in the login or register  (Authorization: Bearer <token>)
    ) {
        const token = authHeader.split(' ')[1];
        return this.authService.deleteUser(targetUser, token);
    }
}
