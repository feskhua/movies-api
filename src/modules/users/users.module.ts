import { UserEntity } from '@modules/users/entities/user.entity';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@modules/users/services';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})

export class UsersModule {
}
