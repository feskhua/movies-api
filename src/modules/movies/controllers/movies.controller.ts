import {MovieEntity} from "@modules/movies/entites/movie.entity";
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@modules/auth/guards';
import { AuthRequest } from '@modules/auth/types/requests';
import {MoviesIsExistGuard, MoviesNotFoundGuard} from '@modules/movies/guards';
import { MoviesCreateRequest, MoviesGetQueryRequest, MoviesUpdateRequest } from '@modules/movies/requests';
import { MovieResource } from '@modules/movies/resources/movie.resource';
import { MoviesService } from '@modules/movies/services';
import { ListControllerReturnType } from '@modules/movies/types/controllers';
import { plainToClass } from 'class-transformer';
import { map } from 'lodash';

@ApiTags('movies')
@ApiBearerAuth()
@Controller('movies')
@UseGuards(AuthGuard)
export class MoviesController {
  public constructor(
    private readonly moviesService: MoviesService
  ) {
  }

  @Get()
  public async list(
    @Req() request: AuthRequest,
    @Query() query: MoviesGetQueryRequest,
  ): Promise<ListControllerReturnType> {
    const { page = 1, perPage = 8 } = query;
    const userId = request.user.id;
    const [list, total] = await this.moviesService.findAll({
      userId: userId,
      page: page,
      perPage: perPage,
    });

    return {
      data: map(list, (movie: MovieEntity): MovieResource => plainToClass(MovieResource, movie)),
      meta: {
        limit: perPage,
        page: page,
        total: total,
      },
    } as ListControllerReturnType;
  }

  @Get(':id')
  @UseGuards(MoviesNotFoundGuard)
  public async item(
    @Param('id') id: string
  ): Promise<MovieResource> {
    return plainToClass(MovieResource, await this.moviesService.findOneWhere({ where: { id } }));
  }

  @Post()
  @UseGuards(MoviesIsExistGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MoviesCreateRequest })
  public async create(
    @Req() request: AuthRequest,
    @Body() body: MoviesCreateRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MovieResource> {
    const movie = await this.moviesService.create({
      ...body,
      file,
      userId: request.user.id,
    });

    return plainToClass(MovieResource, movie);
  }

  @Patch(':id')
  @UseGuards(MoviesNotFoundGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MoviesUpdateRequest })
  public async update(
    @Param('id') id: string,
    @Body() body: MoviesUpdateRequest,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: AuthRequest,
  ): Promise<MovieResource> {
    const userId = request.user.id;

    return plainToClass(MovieResource, await this.moviesService.update({
      ...body,
      id,
      userId,
      file,
    }));
  }

  @Delete(':id')
  @UseGuards(MoviesNotFoundGuard)
  public async delete(@Param('id') id: string): Promise<MovieResource> {
    const movie = await this.moviesService.findOneWhere({ where: { id } });

    await this.moviesService.delete({ id });

    return plainToClass(MovieResource, movie);
  }
}
