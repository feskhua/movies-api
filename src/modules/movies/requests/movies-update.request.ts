import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class MoviesUpdateRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  public title?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  public year?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public poster?: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  public file: unknown;
}
