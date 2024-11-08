import {UserEntity} from "@modules/users/entities/user.entity";
import {BaseEntity, Column, Entity, ManyToOne, PrimaryColumn} from 'typeorm';


@Entity({ name: 'movies' })
export class MovieEntity extends BaseEntity {
  @PrimaryColumn({ generated: 'uuid' })
  public id: string;

  @Column({ unique: true })
  public title: string;

  @Column()
  public year: number;

  @Column()
  public user_id: string;

  @Column({
    nullable: true,
  })
  public poster: string;

  @ManyToOne(() => UserEntity, (user) => user.movies)
  public user: UserEntity;
}
