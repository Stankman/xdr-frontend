import { ApiPaginationLinks } from "./api-pagination-links.model";

export class ApiPagination {
    data: any;
    from: number;
    links: ApiPaginationLinks[];
    path: string;
    to: number;
    total: number;
    current_page: number;
    first_page_url: string;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    per_page: number;
    prev_page_url: string;
}