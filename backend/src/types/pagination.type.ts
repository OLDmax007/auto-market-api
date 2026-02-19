export type QueryType = {
    page?: string;
    limit?: string;
    search?: string;
    sortedBy?: string;
    orderBy?: "asc" | "desc";
};

export type PaginatedResponseType<T> = {
    docs: T[];
    totalDocs: number;
    offset: number;
    limit: number;
    totalPages: number;
    page?: number;
    pagingCounter?: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage?: number | null;
    nextPage?: number | null;
};

export type PaginateOptionsType = {
    page?: number;
    limit?: number;
    sort?: { [key: string]: 1 | -1 };
    select?: string | string[];
    populate?: string | any;
    lean?: boolean;
};

export type PaginateFilterType = {
    $or?: Array<{ [key: string]: any }>;
    [key: string]: any;
};
