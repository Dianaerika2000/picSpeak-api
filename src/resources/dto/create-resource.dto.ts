import { IsOptional, IsString } from "class-validator";

export class CreateResourceDto {
    @IsString()
    type: string;

    @IsString()
    @IsOptional()
    pathDevice?: string;

    @IsOptional()
    textOrigin?: string;

    @IsOptional()
    languageOrigin?: string;

    @IsOptional()
    languageTarget?: string;

    @IsOptional()
    @IsString()
    url?: string;
}
