import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcryptjs from "bcryptjs";
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ConfigService } from "@nestjs/config";
import { UsersService } from 'src/users/users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        private readonly awsService: AwsService,
    ) { }

    async register({
        name,
        lastname,
        username,
        email,
        password,
        birthDate,
        photo_url }: RegisterDto) {

        //const base64ToString = photo_url.toString('base64');
        const base64Image = photo_url.replace(/^data:image\/[a-z]+;base64,/, '');
        const imageBuffer = Buffer.from(base64Image, 'base64'); 
        
        const existUser = await this.usersService.findOneByEmail(email);

        if (existUser) {
            throw new BadRequestException('Email already exists');
        }

        const token = this.generateRandomNumber().toString();

        const { profilePhotoUrl } = await this.awsService.uploadProfilePhotoToS3(imageBuffer, token);

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = await this.usersService.create({
            name,
            lastname,
            username,
            birthDate,
            email,
            photo_url: profilePhotoUrl,
            password: hashedPassword,
            activationToken: token,
            type: 'individual'
        });

        const user = await this.usersService.findOneByEmail(newUser.email);
        const payload = {
            message: "User profile",
            user: user,
        };
        const authToken = await this.jwtService.signAsync(payload);

        await this.mailService.sendVerificationEmail(email, token);

        return {
            message: "User created successfully",
            user: user,
            token: authToken
        };
    }

    async login({ email, password }: LoginDto) {
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            throw new UnauthorizedException("Invalid email");
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException("Invalid password");
        }

        const payload = { 
            message: "User profile",
            user: user, 
        };
        const token = await this.jwtService.signAsync(payload);

        return {
            message: "Login successful",
            user: {
                id: user.id,
                email: user.email
            },
            token: token
        };
    }

    async profile({ email }: { email: string }) {
        return await this.usersService.findOneByEmail(email);
    }

    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        try {
            const { token } = verifyEmailDto;
            const user = await this.usersService.findOneByToken(token);

            if (!user) {
                throw new BadRequestException('INVALID_TOKEN');
            }

            if (user.active) {
                throw new BadRequestException('USER_ALREADY_ACTIVE');
            }

            user.active = true;
            user.activationToken = null;
            await this.usersService.save(user);
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

    updateUserProfile(userId: number, updateData: UpdateProfileDto) {
        return this.usersService.update(userId, updateData);
    }
}
