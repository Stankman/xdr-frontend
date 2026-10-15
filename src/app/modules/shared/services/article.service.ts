import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ArticlePagination } from "../../core/models/article/article-pagination.model";
import { Observable, map } from "rxjs";
import { Article } from "../../core/models/article/article.model";

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    constructor(
        private readonly apiService : ApiService
    ) {}

    public getPaginatedAvailableArticles(page: number = 1, limit: number = 10, search?: string) : Observable<ArticlePagination> {
        const params = {
            page,
            limit,
            ...(search?.trim() ? { q: search.trim() } : {})
        };

        return this.apiService.get<ArticlePagination>(`articles/available`, { params: params }).pipe(
            map((resp) => resp.data)
        );
    }

    public getArticle(id : number) : Observable<Article> {
        return this.apiService.get<Article>(`articles/${id}`).pipe(
            map((resp) => resp.data)
        );
    }
}