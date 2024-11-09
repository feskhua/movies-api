import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@modules/auth';
import { MovieModule } from '@modules/movies/movie.module';
import { UsersModule } from '@modules/users';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        synchronize: true,
        autoLoadEntities: true,
        logging: true,
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER_NAME'),
        password: config.get('DB_USER_PASSWORD'),
        database: config.get('DB_NAME'),
      }),
      inject: [ConfigService],
    } as TypeOrmModuleAsyncOptions),

    AuthModule,
    UsersModule,
    MovieModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
