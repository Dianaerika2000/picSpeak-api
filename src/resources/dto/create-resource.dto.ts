import { IsBase64, IsOptional, IsString } from "class-validator";

export class CreateResourceDto {
    @IsString()
    type: string;

    @IsBase64()
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
