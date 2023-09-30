import { Transform } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { UserType } from "src/enums/user-type.enum";

export class RegisterDto {
    @Transform(({value}) => value.trim())
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    lastname?: string;

    @IsDateString()
    birthDate?: Date;

    @IsString()
    gender?: string;   
    
    @IsString()
    nationality: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Transform(({value}) => value.trim())
    password: string;

    @IsEnum(UserType)
    type: UserType

    @IsString()
    photo_url?: string;
}