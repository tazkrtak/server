import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<T> {
  @ApiProperty()
  page: number;

  @ApiProperty()
  page_size: number;

  @ApiProperty()
  is_last: boolean;

  @ApiProperty()
  total: number;

  @ApiProperty({ type: 'T', isArray: true })
  items: T[];
}
