import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class DeleteDto {
    @ApiProperty({ example: 'user@example.com'})
    @IsEmail()
    @IsNotEmpty()
    email: string
}