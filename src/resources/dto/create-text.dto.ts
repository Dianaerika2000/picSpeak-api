import { IsOptional, IsString } from "class-validator";

export class CreateTextDto {
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
}
