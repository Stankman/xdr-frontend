import { of } from 'rxjs';
import { ApiService } from './api.service';
import { ArticleService } from './article.service';
import { Api } from '../../core/models/api/api.model';
import { Article } from '../../core/models/article/article.model';
import { ArticlePagination } from '../../core/models/article/article-pagination.model';

describe('ArticleService API routes', () => {
  it('loads paginated public articles from the published route', () => {
    const pagination = Object.assign(new ArticlePagination(), { items: [] as Article[] });
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['get']);
    api.get.and.returnValue(of(Object.assign(new Api<ArticlePagination>(), { data: pagination })));
    const service = new ArticleService(api);
    let result: ArticlePagination;

    service.getPaginatedAvailableArticles(2, 5).subscribe(value => result = value);

    expect(api.get).toHaveBeenCalledWith('articles/available', {
      params: { page: 2, limit: 5 }
    });
    expect(result).toBe(pagination);
  });

  it('loads a public article by id', () => {
    const article = Object.assign(new Article(), { id: 7, title: 'News' });
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['get']);
    api.get.and.returnValue(of(Object.assign(new Api<Article>(), { data: article })));
    const service = new ArticleService(api);
    let result: Article;

    service.getArticle(7).subscribe(value => result = value);

    expect(api.get).toHaveBeenCalledWith('articles/7');
    expect(result).toBe(article);
  });

  it('sends normalized public search and omits empty search', () => {
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['get']);
    api.get.and.returnValue(of(Object.assign(new Api<ArticlePagination>(), { data: new ArticlePagination() })));
    const service = new ArticleService(api);
    service.getPaginatedAvailableArticles(3, 10, '  hotel & friends  ').subscribe();
    expect(api.get).toHaveBeenCalledWith('articles/available', {
      params: { page: 3, limit: 10, q: 'hotel & friends' }
    });
    service.getPaginatedAvailableArticles(1, 10, '   ').subscribe();
    expect(api.get).toHaveBeenCalledWith('articles/available', { params: { page: 1, limit: 10 } });
  });
});
