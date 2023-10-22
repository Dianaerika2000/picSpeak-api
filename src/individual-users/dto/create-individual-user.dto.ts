import { User } from "src/users/entities/user.entity";

export class CreateIndividualUserDto {
    type: string;
    photo_url?: string;
    name: string;
    lastname?: string;
    birthDate?: Date;
    gender?: string;      
    nationality: string;
    email: string;
    password: string;
    activationToken: string;
    user?: User;
}
