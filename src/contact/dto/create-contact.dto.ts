import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateContactDto {

    @IsNumber()
    contactId: number;

    @IsNumber()
    user_id: number;
}