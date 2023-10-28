import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from "bcryptjs";
import { IndividualUsersService } from 'src/individual-users/individual-users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly individualUsersService: IndividualUsersService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
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

        const token = this.generateRandomNumber().toString();

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
            password: hashedPassword,
            activationToken: token
        });

        await this.mailService.sendVerificationEmail(email, token);

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

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        try {
          const { token } = verifyEmailDto;
          const user = await this.individualUsersService.findOneByToke(token);
    
          if (!user) {
            throw new BadRequestException('INVALID_TOKEN');
          }
    
          if (user.active) {
            throw new BadRequestException('USER_ALREADY_ACTIVE');
          }
    
          user.active = true;
          user.activationToken = null;
          await this.individualUsersService.save(user);
          return {
            message: 'Email del usuario verificado correctamente',
            user
          }
        } catch (error) {
          return error;
        }
    }

    generateRandomNumber() {
        const min = 1000;
        const max = 9999; 
    
        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    
        return randomNumber;
    }
}
