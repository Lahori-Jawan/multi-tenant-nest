import { IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  limit: number;

  @IsOptional()
  page: number;
}

export const makePagination = (query: PaginationQueryDto) => {
  const limit = Math.abs(Number(query.limit)) || 10;
  const page = Math.abs(Number(query.page)) || 1;
  const skip = (page - 1) * limit;

  return {
    limit,
    skip,
  };
};
