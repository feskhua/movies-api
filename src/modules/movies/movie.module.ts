import { MoviesController } from '@modules/movies/controllers/movies.controller';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieEntity } from '@modules/movies/entites/movie.entity';
import { MoviesService } from '@modules/movies/services/movies.service';
import { UsersModule } from '@modules/users';

@Global()
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([MovieEntity]),
    JwtModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})

export class MovieModule {
}
