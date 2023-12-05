import { IsBoolean, IsNumber, IsString } from "class-validator";

export class UpdateContactDto {
    @IsString()
    nickname: string;

    @IsBoolean()
    status: boolean;
}