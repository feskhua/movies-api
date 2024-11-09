import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable
} from '@nestjs/common';
import { MoviesService } from '@modules/movies/services';
import {cloneDeep} from "lodash";
import * as multer from 'multer'
import {Not} from "typeorm";

@Injectable()
export class MoviesExistGuard implements CanActivate {
  @Inject(MoviesService)
  private readonly moviesService: MoviesService;
  
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request?.params?.id;
    const userId = request.user.id;
    const cloneRequest = cloneDeep(request);
    
    const postMulterRequest: any = await new Promise((resolve, reject) => {
      multer().any()(cloneRequest, {} as any, function(err) {
        if (err) reject(err);
        resolve(cloneRequest);
      });
    });
    
    const isExists = await this.moviesService.one({
      where: {
        title: postMulterRequest.body.title,
        user_id: userId,
        id: Not(id),
      },
    });
    
    if (isExists) {
      throw new BadRequestException('Movie already exists');
    }
    
    return true;
  }
}
