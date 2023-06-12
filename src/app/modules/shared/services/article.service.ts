import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { ArticlePagination } from "../../core/models/article/article-pagination.model";
import { Observable, map } from "rxjs";
import { Api } from "../../core/models/api/api.model";
import { Article } from "../../core/models/article/article.model";

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    constructor(
        private readonly apiService : ApiService
    ) {}

    public getPaginatedAvailableArticles(page: number = 1, limit: number = 10) : Observable<ArticlePagination> {
        const params = {
            page,
            limit
        };

        return this.apiService.get(`articles/available`, { params: params }).pipe(
            map((resp: Api) => resp.data)
        );
    }

    public getArticle(id : number) : Observable<Article> {
        return this.apiService.get(`articles/${id}`).pipe(
            map((resp: Api) => resp.data)
        );
    }
}