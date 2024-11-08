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
export class MoviesNotFoundGuard implements CanActivate {
  @Inject(MoviesService)
  private readonly moviesService: MoviesService;

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request?.params?.id;

    if (!id) {
      this.error('Movie not found', HttpStatus.NOT_FOUND);
    }

    const movie = await this.moviesService.findOneWhere({ where: { id } });

    if (!movie) {
      this.error('Movie not found', HttpStatus.NOT_FOUND);
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
