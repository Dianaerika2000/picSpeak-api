import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from "bcryptjs";
import { IndividualUsersService } from 'src/individual-users/individual-users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly individualUsersService: IndividualUsersService,
        private readonly jwtService: JwtService
    ){}

    async register({
        name, 
        lastname, 
        email, 
        password, 
        birthDate, 
        //gender, 
        /* nationality, 
        type,  */
        photo_url}: RegisterDto) {
        const existUser = await this.individualUsersService.findOneByEmail(email);

        if (existUser) {
            throw new BadRequestException('Email already exists');
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = await this.individualUsersService.create({
            //type, 
            photo_url, 
            name, 
            lastname, 
            birthDate, 
            //gender, 
            //nationality, 
            email, 
            password: hashedPassword
        });

        return {
            message: "User created successfully",
            user: newUser
        };
    }

    async login({ email, password}: LoginDto) {
        const user = await this.individualUsersService.findOneByEmail(email);

        if (!user) {
            throw new UnauthorizedException("Invalid email");
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }

        const payload = { email: user.email };
        const token = await this.jwtService.signAsync(payload);

        return {
            message: "Login successful",
            token: token,
            email: user.email
        };
    }

    async profile({ email }: { email: string }) {
        return await this.individualUsersService.findOneByEmail(email);
    }
}
