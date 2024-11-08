import {MovieEntity} from "@modules/movies/entites/movie.entity";
import { FindOptionsWhere } from 'typeorm';

export interface MoviesServiceCreateParams {
  title: string;
  userId: string;
  year: number;
  file?: Express.Multer.File;
}

export interface MoviesServiceUpdateParams {
  id: string;
  title?: string;
  poster?: string;
  year?: number;
  userId?: string;
  file?: Express.Multer.File;
}

export interface MoviesFindAllParams {
  userId: string;
  page: number;
  perPage: number;
}

export interface MoviesFindOneAndWhere {
  where: FindOptionsWhere<MovieEntity>[] | FindOptionsWhere<MovieEntity>
}

export interface MoviesDeleteParams {
  id: string;
}
