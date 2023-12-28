import { IsEmpty, IsOptional, IsString } from "class-validator";

export class UpdateNacionalityDto{
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    url?: string;
}