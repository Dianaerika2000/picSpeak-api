import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateStatusDto {
    @IsString()
    statusInfo: string;

    @IsOptional()
    @IsString()
    icon?: string;
}