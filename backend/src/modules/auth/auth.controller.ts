import { Controller, Post, Body, HttpCode, HttpStatus} from '@nestjs/common';
import { CreateRegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    register(@Body() createRegisterDto: CreateRegisterDto) {
        return this.authService.register(createRegisterDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}