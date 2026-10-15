import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router } from "@angular/router";
import { EMPTY, Observable, catchError } from "rxjs";
import { Article } from "src/app/modules/core/models/article/article.model";
import { ArticleService } from "src/app/modules/shared/services/article.service";

@Injectable({ providedIn: 'root'})
export class ArticleResolver {
    constructor(
        private readonly articleService : ArticleService,
        private readonly router: Router
    ) {}

    resolve(route : ActivatedRouteSnapshot) : Observable<Article> {
        return this.articleService.getArticle(Number(route.params['slug'].split('-')[0]))
        .pipe(catchError(() => {
            this.router.navigateByUrl('/not-found');
            return EMPTY;
        }));
    }
}