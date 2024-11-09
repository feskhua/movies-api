import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest, AuthRequestPayload } from '@modules/auth/types/requests';
import { UsersService } from '@modules/users/services';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(
    private moduleRef: ModuleRef,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authorization = request.headers['authorization'];
    const [type, token] = authorization ? authorization.split(' ') : [];
    const secret = this.configService.get<string>('JWT_SECRET');
    
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException();
    }

    const jwtService = this.moduleRef.get(JwtService, { strict: false });
    
    try {
      const reqUserData = (await jwtService.verifyAsync<AuthRequestPayload>(token, { secret }));
      
      const user = await this.usersService.one(reqUserData.id);
      
      
      
      request['user'] = reqUserData;

      if (user) {
        return true;
      }
    } catch {
      // empty
    }

    throw new UnauthorizedException();
  }
}
