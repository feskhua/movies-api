import { UserEntity } from '@modules/users/entities/user.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';

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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  public created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)', onUpdate: 'CURRENT_TIMESTAMP(6)' })
  public updated_at: Date;
}
