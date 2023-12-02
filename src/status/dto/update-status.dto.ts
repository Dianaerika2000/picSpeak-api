import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateStatusDto {
    @IsString()
    status_info: string;

    @IsOptional()
    @IsString()
    icon?: string;
}