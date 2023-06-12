import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ArticlePagination } from "src/app/modules/core/models/article/article-pagination.model";
import { ArticleService } from "src/app/modules/shared/services/article.service";

@Injectable({ providedIn: 'root'})
export class ArticlesResolver {
    constructor(
        private readonly articleService : ArticleService
    ) {}

    resolve(route : ActivatedRouteSnapshot) : Observable<ArticlePagination> {
        return this.articleService.getPaginatedAvailableArticles(1,10);
    }
}