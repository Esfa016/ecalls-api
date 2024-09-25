import { QueryParamsDTO } from "./Validations/pagination";

export class PaginationHelper {
  static paginateQuery(paginationDto: QueryParamsDTO): number {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;
    return skip;
  }
}
