import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/app/common/auth/public.meta';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Todo:: make it 'protected' for tenants user registration i.e. /lcs/api/auth/register
  @Public()
  @Post('register')
  create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto, req.params.tenant);
  }

  @Public()
  @Post('login')
  login(@Req() req: Request, @Body() loginUserDto: any) {
    return this.authService.loginUser(loginUserDto, req.params.tenant);
  }
}
