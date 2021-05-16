import { ApiProperty } from '@nestjs/swagger';
import { IsObject, Max, Min } from 'class-validator';

export class PaginatedQuery<T> {
  @ApiProperty()
  @Min(0)
  page: number;

  @ApiProperty({ default: 10 })
  @Min(10)
  @Max(80)
  page_size: number;

  @ApiProperty({ type: 'T' })
  @IsObject()
  filter: T;
}
