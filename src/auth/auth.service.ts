import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { IndividualUsersService } from 'src/individual-users/individual-users.service';
import { User } from 'src/users/entities/user.entity';
import { IndividualUser } from 'src/individual-users/entities/individual-user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly individualUsersService: IndividualUsersService
    ){}

    async register(registerDto: RegisterDto) {
        const existUser = await this.individualUsersService.findOneByEmail(registerDto.email);

        if (existUser) {
            throw new BadRequestException('User already exists');
        }
        
        const user = new User();
        user.type = registerDto.type;
        user.photoUrl = registerDto.photo_url;

        const individual = new IndividualUser();
        individual.name = registerDto.name;
        individual.lastname = registerDto.lastname;
        individual.email = registerDto.email;
        individual.password = registerDto.password;
        individual.birthDate = registerDto.birth_date;
        individual.gender = registerDto.gender;
        individual.nationality = registerDto.nationality;

        user.individual = individual;

        await this.individualUsersService.create(individual);
        await this.usersService.create(user);

        return 'creado?';
    }

    login() {
        return 'login';
    }
}
