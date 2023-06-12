import { ApiPagination } from "../api/api-pagination.model";
import { Article } from "./article.model";

export class ArticlePagination extends ApiPagination {
    override items: Article[];
}