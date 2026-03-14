import { SortOrderEnum } from "../enums/sort.enum";
import { QueryType } from "../types/pagination.type";

export const getPaginationOptions = (query: QueryType = {}) => {
    const {
        page = 1,
        limit = 10,
        sortedBy = "createdAt",
        orderBy = "desc",
    } = query;

    const sortOrder =
        orderBy === "asc" ? SortOrderEnum.ASC : SortOrderEnum.DESC;

    return {
        page: Number(page),
        limit: Number(limit),
        sort: { [sortedBy]: sortOrder },
        lean: true,
    };
};
