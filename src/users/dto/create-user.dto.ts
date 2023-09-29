import { UserType } from "src/enums/user-type.enum";

export class CreateUserDto {
    type: UserType;
    photo_url?: string;
}
