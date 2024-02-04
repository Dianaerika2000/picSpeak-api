import { Transform } from "class-transformer";
import { IsBase64, IsDateString, IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    lastname?: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(2)
    username: string;

    @IsDateString()
    birthDate?: Date;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Transform(({value}) => value.trim())
    password: string;

    @IsOptional()
    @IsBase64()
    photo_url?: string;
}