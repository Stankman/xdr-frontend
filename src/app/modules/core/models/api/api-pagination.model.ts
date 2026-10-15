import { ApiPaginationLinks } from "./api-pagination-links.model";
import { ApiPaginationMeta } from "./api-pagination-meta.model";

export class ApiPagination<T = unknown> {
    items!: T[];
    from?: number;
    links!: ApiPaginationLinks;
    meta!: ApiPaginationMeta;
}