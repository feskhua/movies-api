import { MovieEntity } from '@modules/movies/entites/movie.entity';
import { FindOptionsWhere } from 'typeorm';

export interface MoviesCreateParams {
  title: string;
  userId: string;
  year: number;
  file?: Express.Multer.File;
}

export interface MoviesUpdateParams {
  id: string;
  title?: string;
  poster?: string;
  year?: number;
  userId?: string;
  file?: Express.Multer.File;
}

export interface MoviesAllParams {
  userId: string;
  page: number;
  perPage: number;
}

export interface MoviesOne {
  where?: FindOptionsWhere<MovieEntity>[] | FindOptionsWhere<MovieEntity>;
}

export interface MoviesDeleteParams {
  id: string;
}
