import { ApiProperty } from '@nestjs/swagger';

export class PaginationBody<T> {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty({ type: 'T' })
  filter: T;
}
