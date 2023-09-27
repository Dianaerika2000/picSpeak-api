import { User } from "src/users/entities/user.entity";

export class CreateIndividualUserDto {
    name: string;
    lastname?: string;
    birth_date?: Date;
    gender?: string;      
    nationality: string;
    email: string;
    password: string;
    user: User;
}
