import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponse<T> {
  @ApiProperty()
  page: number;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  lastPage: boolean;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: 'T', isArray: true })
  items: T[];
}
