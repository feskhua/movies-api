import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { MoviesService } from '@modules/movies/services';

@Injectable()
export class MoviesIsExistGuard implements CanActivate {
  @Inject(MoviesService)
  private readonly moviesService: MoviesService;
  
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const id = request?.params?.id;
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const body = request.body;
    
    const isExists = await this.moviesService.findOneWhere({
      where: {
        year: body.year,
        title: body.title,
        user_id: userId,
      },
    });
    
    if (isExists) {
      throw new Error('Movie with the same title and year already exists');
    }
    
    return true;
  }
  
  protected error(
    message?: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ): never {
    throw new HttpException(message ? message : 'Bad request', status);
  }
}
