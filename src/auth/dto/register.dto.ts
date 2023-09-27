import { Transform } from "class-transformer";
import { IsDate, IsDateString, IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    lastname?: string;

    @IsDateString()
    birth_date?: Date;

    @IsString()
    gender?: string;   
    
    @IsString()
    nationality: string;

    @IsEmail()
    email: string;

    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    type: string

    @IsString()
    photo_url?: string;
}