import { IsBase64, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsBase64()
    @IsOptional()
    photo_url: string;

    @IsString()
    name: string;

    @IsString()
    lastname: string;

    @IsString()
    username: string;

    birthDate: Date;
    email: string;
    password: string;
    activationToken: string;
    type: string;
}
