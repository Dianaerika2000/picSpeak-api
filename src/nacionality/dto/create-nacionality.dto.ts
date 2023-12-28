import { IsEmpty, IsOptional, IsString } from "class-validator";

export class CreateNacionalityDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    url?: string;
}