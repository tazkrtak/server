export interface PaginationResponse<T> {
  page: number;
  pageSize: number;
  lastPage: boolean;
  total: number;
  items: T[];
}
