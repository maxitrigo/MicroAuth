import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({ example: '123Password!' })
    @IsString()
    @IsNotEmpty()
    currentPassword: string;

    @ApiProperty({ example: 'Password123.!' })
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}