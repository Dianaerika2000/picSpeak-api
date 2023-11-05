import { User } from "src/users/entities/user.entity";

export class CreateIndividualUserDto {
    photo_url?: string;
    name: string;
    lastname?: string;
    username?: string;
    birthDate?: Date;
    email: string;
    password: string;
    activationToken: string;
    user?: User;
}
