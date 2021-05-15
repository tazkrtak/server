export interface PaginationBody<T> {
  page: number;
  pageSize: number;
  filter: T;
}
