import { CanActivate, ExecutionContext, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { MoviesService } from '@modules/movies/services';

@Injectable()
export class MoviesNotFoundGuard implements CanActivate {
  @Inject(MoviesService)
  private readonly moviesService: MoviesService;

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request?.params?.id;
    const movie = id ? await this.moviesService.one({ where: { id } }) : null;

    if (!id || !movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }
}
