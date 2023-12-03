import { IsOptional } from "class-validator";

export class CreateChatDto {
    @IsOptional()
    fondo: string;
    senderUser: number;
    receivingUser: number;
}