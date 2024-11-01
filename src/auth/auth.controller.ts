import { Body, Controller, Delete, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from 'src/dto/register.dto';
import { ChangePasswordDto } from 'src/dto/changePassword.dto';
import { RequestResetDto } from 'src/dto/requestReset.dto';
import { ResetPasswordDto } from 'src/dto/resetPassword.dto';
import { DeleteDto } from 'src/dto/delete.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('register')
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async register(@Body() RegisterDto: RegisterDto) {
        const { email, password } = RegisterDto
        const token = await this.authService.register(email, password);
        return { login: "true", token: token.token }
    }

    @Post('login')
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async login(@Body()RegisterDto: RegisterDto) {
        const { email, password } = RegisterDto
        const token = await this.authService.login(email, password);
        return { login: "true", token: token.token }
    }

    @Post('change-password')
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @UseGuards(JwtAuthGuard) // the token must be provided in the header, the same token you requested in the login or register (Authorization: Bearer <token>)
    async changePassword(@Headers('authorization') authHeader: string, @Body() ChangePasswordDto: ChangePasswordDto) {
        const { currentPassword, newPassword } = ChangePasswordDto
        const token = authHeader.split(' ')[1];
        return this.authService.changePassword(token, currentPassword, newPassword);
    }

    @Post('request-password-reset')
    @ApiResponse({ status: 200, description: 'Password reset email sent' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async requestPasswordReset(@Body('') RequestResetDto: RequestResetDto) {
        const { email } = RequestResetDto
        return this.authService.requestPasswordReset(email);
    }

    @Post('reset-password')
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async resetPassword(@Body() ResetPasswordDto: ResetPasswordDto) {
        const { resetToken, newPassword } = ResetPasswordDto
        return this.authService.resetPassword(resetToken, newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async deleteUser(
        @Body() DeleteDto: DeleteDto,
        @Headers('authorization') authHeader: string // the same token you requested in the login or register  (Authorization: Bearer <token>)
    ) {
        const { email } = DeleteDto
        const targetUser = email
        const token = authHeader.split(' ')[1];
        return this.authService.deleteUser(targetUser, token);
    }
}
