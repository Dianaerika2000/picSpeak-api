import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStatusIndividualUserDto {
    @IsString()
    status_info: string;

    @IsOptional()
    @IsString()
    icon?: string;

    @IsNumber()
    user_id: number;
}