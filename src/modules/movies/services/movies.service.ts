import { MovieEntity } from '@modules/movies/entites/movie.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MoviesAllParams,
  MoviesCreateParams,
  MoviesDeleteParams,
  MoviesOne,
  MoviesUpdateParams,
} from '@modules/movies/types';

import { DeleteResult, Repository } from 'typeorm';
import { Files } from '@app/utils';

@Injectable()
export class MoviesService {
  @InjectRepository(MovieEntity)
  private movieRepository: Repository<MovieEntity>;

  public async all(
    params: MoviesAllParams,
  ): Promise<[MovieEntity[], number]> {
    const { page, perPage, userId } = params;

    return this.movieRepository.findAndCount({
      where: { user_id: userId },
      take: perPage,
      skip: (page - 1) * perPage,
      order: { created_at: 'ASC' },
    });
  }

  public one(params: MoviesOne): Promise<MovieEntity> {
    const {
      where = {},
    } = params;

    return this.movieRepository.findOne({ where });
  }

  public async create(props: MoviesCreateParams): Promise<MovieEntity> {
    const { file, userId, ...params } = props;

    return this.movieRepository.save({
      ...params,
      user_id: userId,
      ...(file ? { poster: Files.save(file) } : {}),
    });
  }

  public async update(props: MoviesUpdateParams): Promise<MovieEntity | null> {
    const { file, ...params } = props;
    const movie = await this.one({ where: { id: params.id } });

    if (!movie) {
      return null;
    }

    if (file && movie.poster) {
      Files.remove(movie.poster);
    }

    return this.movieRepository.save({
      ...movie,
      ...params,
      ...(file ? { poster: Files.save(file) } : {}),
    });
  }

  public async delete(params: MoviesDeleteParams): Promise<DeleteResult | null> {
    const { id } = params;
    const movie = await this.one({ where: { id } });

    if (!movie) {
      return null;
    }

    if (movie.poster) {
      Files.remove(movie.poster);
    }

    return this.movieRepository.delete({ id });
  }
}
