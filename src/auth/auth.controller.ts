import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @Post('register')
    register(
        @Body() registerDto: RegisterDto,
    ) {
        return this.authService.register(registerDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    login(
        @Body() loginDto: LoginDto
    ) {
        return this.authService.login(loginDto);
    }

    @ApiBearerAuth()
    @Get('profile')
    @UseGuards(AuthGuard)
    profile(@Request() req) {
        return req.user;
    }

}
