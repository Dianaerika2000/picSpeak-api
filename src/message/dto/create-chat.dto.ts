import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { CreateMessageDto } from "./create-message.dto";

export class CreateChatDto {
    @IsOptional()
    fondo: string;
    senderUser: number;
    receivingUser: number;
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMessageDto)
    resources: CreateMessageDto[];
}