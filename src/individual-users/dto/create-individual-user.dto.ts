import { UserType } from "src/enums/user-type.enum";
import { User } from "src/users/entities/user.entity";

export class CreateIndividualUserDto {
    type: UserType;
    photo_url?: string;
    name: string;
    lastname?: string;
    birthDate?: Date;
    gender?: string;      
    nationality: string;
    email: string;
    password: string;
    user?: User;
}
