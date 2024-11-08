import {MovieEntity} from "@modules/movies/entites/movie.entity";
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  MoviesDeleteParams,
  MoviesFindAllParams,
  MoviesFindOneAndWhere,
  MoviesServiceCreateParams,
  MoviesServiceUpdateParams,
} from '@modules/movies/types';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import * as path from 'path';

import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  @InjectRepository(MovieEntity)
  private movieRepository: Repository<MovieEntity>;

  @Inject()
  private configService: ConfigService;

  private getStoragePath(...parts: string[]): string {
    return path.join(
      path.resolve(this.configService.get('STORAGE_DIRECTORY', 'storage')),
      ...(parts ?? []),
    );
  }

  private async savePoster(poster: Express.Multer.File): Promise<string> {
    const fileName = `${randomUUID()}-${poster.originalname}`;
    
    
    const filePath = this.getStoragePath(fileName);
    
    fs.writeFileSync(filePath, poster.buffer);

    return fileName;
  }

  private removePoster(poster: string): void {
    const filePath = this.getStoragePath(poster);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  public async create(props: MoviesServiceCreateParams): Promise<MovieEntity> {
    const { file, userId, ...params } = props;
    let poster = null;

    if (file) {
      try {
        poster = await this.savePoster(file);
      } catch (e) {
        console.log(e)
        throw new Error('Error save poster');
      }
    }
    
    return this.movieRepository.save({
      ...params,
      user_id: userId,
      poster,
    });
  }

  public async update(props: MoviesServiceUpdateParams): Promise<MovieEntity> {
    const { file, ...params } = props;

    const movie = await this.findOneWhere({ where: { id: params.id } });

    let fileName: string;

    if (!movie) {
      throw new Error('Error update movie');
    }

    if (file) {
      fileName = await this.savePoster(file);

      if (movie.poster) {
        this.removePoster(movie.poster);
      }
    }

    return this.movieRepository.save({
      ...movie,
      ...params,
      ...(fileName ? { poster: fileName } : {}),
    });
  }

  public async findAll(
    params: MoviesFindAllParams,
  ): Promise<[MovieEntity[], number]> {
    const { page, perPage, userId } = params;

    return this.movieRepository.findAndCount({
      where: { user_id: userId },
      take: perPage,
      skip: (page - 1) * perPage,
    });
  }

  public findOneWhere(params: MoviesFindOneAndWhere): Promise<MovieEntity> {
    const { where } = params;

    return this.movieRepository.findOne({ where });
  }

  public async delete(params: MoviesDeleteParams): Promise<DeleteResult> {
    const { id } = params;

    const movie = await this.findOneWhere({ where: { id } });

    if (!movie) {
      throw new Error('Error delete movie');
    }

    if (movie.poster) {
      this.removePoster(movie.poster);
    }

    return this.movieRepository.delete({ id });
  }
}
