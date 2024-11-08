import {Body, Controller, Post, Res} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { AuthLoginRequest, AuthRegisterRequest } from '@modules/auth/requests';
import { UsersService } from '@modules/users/services';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  public constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  public async login(
    @Body() body: AuthLoginRequest,
    @Res() response: Response
  ): Promise<{
    accessToken: string;
  }> {
    const { email, password } = body;
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new Error('User not found');
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      throw new Error('User not found');
    }
    
    const accessToken = await this.jwtService.signAsync({ id: user.id });
    
    return {
      accessToken,
    };
  }

  @Post('register')
  public async register(
    @Body() body: AuthRegisterRequest,
  ): Promise<{
    accessToken: string;
  }> {
    const { email, password } = body;

    const isExist = await this.usersService.findByEmail(email);

    if (isExist) {
      throw new Error('User already exists');
    }

    const user = await this.usersService.create({ email, password });

    return {
      accessToken: await this.jwtService.signAsync({ id: user.id }),
    };
  }
}
