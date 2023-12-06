import { IsOptional, IsString } from "class-validator";

export class CreateImageDto {
    @IsString()
    type: string;

    @IsString()
    @IsOptional()
    pathDevice?: string;
}
