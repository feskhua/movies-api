import {CanActivate, ExecutionContext, HttpException, Injectable} from '@nestjs/common';
import {AuthRequest } from '@modules/auth/types/requests';
import {UsersService} from '@modules/users/services';

@Injectable()
export class ExistGuard implements CanActivate {
  public constructor(
    private usersService: UsersService,
  ) {
  }
  
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const body = request.body as unknown as { email: string };
    
    const isExist = await this.usersService.oneByEmail(body.email);
    
    if (isExist) {
      throw new HttpException('User already exists', 400);
    }
    
    return true;
  }
}
