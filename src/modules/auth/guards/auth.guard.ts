import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest, AuthRequestPayload } from '@modules/auth/types/requests';
import { UsersService } from '@modules/users/services';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private jwtService: JwtService,
    private moduleRef: ModuleRef,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const authorization = request.headers['authorization'];
    const [type, token] = authorization ? authorization.split(' ') : [];

    const bearerToken = type === 'Bearer' ? token : undefined;

    if (!bearerToken) {
      throw new UnauthorizedException();
    }

    const jwtService = this.moduleRef.get(JwtService, { strict: false });

    try {
      request['user'] = (await jwtService.verifyAsync<AuthRequestPayload>(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      ));
    } catch {
      throw new UnauthorizedException();
    }

    const user = this.usersService.findOne(request.user.id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
