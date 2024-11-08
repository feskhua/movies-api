import {MovieEntity} from "@modules/movies/entites/movie.entity";
import {BaseEntity, Column, Entity, OneToMany, PrimaryColumn} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ generated: 'uuid' })
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @OneToMany(() => MovieEntity, (movie) => movie.user_id)
  public movies: MovieEntity[];
}
