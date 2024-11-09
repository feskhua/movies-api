import {ExistGuard} from "@modules/auth/guards";
import {Body, Controller, Inject, Post, UseGuards} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { AuthSignInRequest, AuthSignUpRequest } from '@modules/auth/requests';
import { UsersService } from '@modules/users/services';
import * as bcrypt from 'bcryptjs';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Inject()
  private jwtService: JwtService;

  @Inject()
  private usersService: UsersService;

  @Post('login')
  public async signIn(
    @Body() body: AuthSignInRequest,
  ): Promise<{
    token: string;
  }> {
    const { email, password } = body;
    const user = await this.usersService.oneByEmail(email);
    const passwordIsCorrect = user ? await bcrypt.compare(password, user.password) : null;

    if (!user || !passwordIsCorrect) {
      throw new Error('User not found');
    }

    return {
      token: await this.jwtService.signAsync({ id: user.id }),
    };
  }

  @Post('register')
  @UseGuards(ExistGuard)
  public async signUp(
    @Body() body:AuthSignUpRequest,
  ): Promise<{
    token: string;
  }> {
    const { email, password } = body;

    const user = await this.usersService.create({ email, password });

    return {
      token: await this.jwtService.signAsync({ id: user.id }),
    };
  }
}
