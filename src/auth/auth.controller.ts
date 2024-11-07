import { Body, Controller, Delete, Get, Headers, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from 'src/dto/register.dto';
import { ChangePasswordDto } from 'src/dto/changePassword.dto';
import { RequestResetDto } from 'src/dto/requestReset.dto';
import { ResetPasswordDto } from 'src/dto/resetPassword.dto';
import { DeleteDto } from 'src/dto/delete.dto';
import { ChangeRoleDto } from 'src/dto/changeRole.dto';
import { LoginDto } from 'src/dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('staff')
    @UseGuards( JwtAuthGuard )
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Success' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Not found' })
    async getStaff(@Headers('authorization') authHeader: string) {
        return await this.authService.getStaff();
    }

    @Post('register')
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async register(@Body() RegisterDto: RegisterDto) {
        const token = await this.authService.register(RegisterDto);
        return { login: "true", token: token.token }
    }

    @Post('login')
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async login(@Body()LoginDto: LoginDto) {
        const { email, password } = LoginDto
        const response = await this.authService.login(email, password);
        return { login: "true", token: response.token, name: response.name, email: response.email, role: response.role }
    }

    @Post('change-password')
    @UseGuards(JwtAuthGuard) // the token must be provided in the header, the same token you requested in the login or register (Authorization: Bearer <token>)
    @ApiResponse({ status: 200, description: 'Password changed successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBearerAuth()
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

    @Patch('role')
    @ApiResponse({ status: 200, description: 'User role updated successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBearerAuth()
    async updateUserRole(
        @Body() ChangeRoleDto: ChangeRoleDto,
        @Headers('authorization') authHeader: string // the same token you requested in the login or register  (Authorization: Bearer <token>)
    ) {
        const { email, role } = ChangeRoleDto
        const token = authHeader.split(' ')[1];
        return this.authService.updateUserRole(token, email, role);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete')
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiBearerAuth()
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
