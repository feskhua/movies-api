import { UserEntity } from '@modules/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersCreateParams } from '@modules/users/types/services';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  @InjectRepository(UserEntity)
  private userRepository: Repository<UserEntity>;

  public async one(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  public async oneByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  public async create(params: UsersCreateParams): Promise<UserEntity> {
    const { email, password } = params;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.save({
      email,
      password: hashedPassword,
    });
  }
}
