import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty({ example: 'jhfddasj123kjb198983bkjbaks349847jbfkdjbfd230187312kjdfbf' })
    @IsNotEmpty()
    @IsString()
    resetToken: string

    @ApiProperty({ example: '123Password!' })
    @IsNotEmpty()
    @IsString()
    newPassword: string
}