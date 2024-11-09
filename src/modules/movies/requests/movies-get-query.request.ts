import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class MoviesGetQueryRequest {
  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  public page?: number;

  @ApiProperty({
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  public perPage?: number;
}
