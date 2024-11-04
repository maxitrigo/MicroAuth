import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ChangeRoleDto {

    @ApiProperty({ example: 'staff' })
    @IsString()
    @IsNotEmpty()
    role?: string

    @ApiProperty({ example: 'user@example.com' })
    @IsString()
    @IsNotEmpty()
    email?: string
}