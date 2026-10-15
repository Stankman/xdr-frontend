import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of } from 'rxjs';
import { Account } from 'src/app/modules/core/models/account/account.model';
import { Avatar } from 'src/app/modules/core/models/avatar/avatar.model';
import { Article } from 'src/app/modules/core/models/article/article.model';
import { ArticlePagination } from 'src/app/modules/core/models/article/article-pagination.model';
import { LookSizes } from 'src/app/modules/core/models/look/look-sizes.model';
import { AccountService } from 'src/app/modules/shared/services/account.service';
import { ArticleService } from 'src/app/modules/shared/services/article.service';
import { LanguageService } from 'src/app/modules/shared/services/language.service';
import { LookService } from 'src/app/modules/shared/services/look.service';
import { HomeComponent } from './home.component';
import { HomeModule } from './home.module';

describe('/me dashboard', () => {
  let account: BehaviorSubject<Account | null>;
  let articles: BehaviorSubject<ArticlePagination>;
  let looks: jasmine.SpyObj<LookService>;

  beforeEach(async () => {
    account = new BehaviorSubject<Account | null>(Object.assign(new Account(), {
      id: 1,
      email: 'test@example.invalid',
      activeAvatar: Object.assign(new Avatar(), {
        username: 'PixelExplorer', look: 'test-figure', credits: 1280,
        motto: 'My pixel world', lastLogin: Math.floor(Date.now() / 1000) - 3600
      })
    }));
    articles = new BehaviorSubject(Object.assign(new ArticlePagination(), {
      items: [Object.assign(new Article(), { id: 1, title: 'Hotel news', description: 'A new story', image: '' })]
    }));
    looks = jasmine.createSpyObj<LookService>('LookService', ['get']);
    looks.get.and.returnValue('/assets/resources/images/habbo_mannequin2.gif');

    await TestBed.configureTestingModule({
      imports: [HomeModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
      providers: [
        { provide: AccountService, useValue: { accountObservable: account } },
        { provide: ArticleService, useValue: { getPaginatedAvailableArticles: () => of(articles.value) } },
        { provide: LookService, useValue: looks },
        { provide: LanguageService, useValue: { getCurrentCulture: () => 'en-US' } }
      ]
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      ME: { TITLE: 'Home', WELCOME: 'Welcome back', DASHBOARD: { ALL_NEWS: 'All news' } }
    });
    translate.setTranslation('es', {
      ME: { TITLE: 'Inicio', WELCOME: 'Bienvenido de nuevo', DASHBOARD: { ALL_NEWS: 'Todas las noticias' } }
    });
    translate.use('en').subscribe();
  });

  it('renders image-led news, real navigation and the original avatar presentation without upcoming cards', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll('h1').length).toBe(1);
    expect(root.querySelector('h1')?.textContent).toContain('Home');
    expect(root.querySelector('h1')?.textContent).not.toContain('Welcome back');
    expect(root.querySelector('.profile-identity p')?.textContent).toBe('Welcome back');
    expect(root.querySelector('.profile-identity')?.textContent).not.toContain('YOUR_AVATAR');
    expect(root.querySelector('.habbo-mannequin-container.head-large .avatar-container img')).not.toBeNull();
    expect(looks.get).toHaveBeenCalledWith({ look: 'test-figure', size: LookSizes.LARGE });
    expect(root.querySelector('.article-slide.image-first h3')?.textContent).toContain('Hotel news');
    expect(root.querySelector('.hotel-enter')?.getAttribute('href')).toBe('/client');
    expect(root.querySelector('.text-link')?.getAttribute('href')).toBe('/articles');
    expect(root.querySelectorAll('.explore-links a').length).toBe(2);
    expect(root.textContent).not.toContain('Coming soon');
    expect(root.textContent).not.toContain('ME.HERO.VIP.EXPIRE');
    fixture.destroy();
  });

  it('updates translations and account data, and safely removes the profile after sign-out', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    TestBed.inject(TranslateService).use('es').subscribe();
    account.next(Object.assign(new Account(), {
      id: 1, email: 'test@example.invalid',
      activeAvatar: Object.assign(new Avatar(), { username: 'NewAvatar', look: 'new-figure', credits: 250, lastLogin: Date.now() / 1000 })
    }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Inicio');
    expect(fixture.nativeElement.querySelector('.profile-identity p').textContent).toBe('Bienvenido de nuevo');
    expect(fixture.nativeElement.querySelector('#profile-name').textContent).toBe('NewAvatar');
    expect(fixture.nativeElement.querySelector('.wallet').textContent).toContain('250');
    account.next(null);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.profile-panel')).toBeNull();
    fixture.destroy();
  });

  it('retains the avatar scene image while changing its gradient with the theme', () => {
    const originalClass = document.body.className;
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const scene: HTMLElement = fixture.nativeElement.querySelector('.profile-scene');
    try {
      document.body.className = 'dark';
      const darkBackground = getComputedStyle(scene).backgroundImage;
      document.body.className = 'light';
      const lightBackground = getComputedStyle(scene).backgroundImage;
      expect(darkBackground).toContain('habbo_bg_hero.png');
      expect(lightBackground).toContain('habbo_bg_hero.png');
      expect(lightBackground).not.toBe(darkBackground);
    } finally {
      document.body.className = originalClass;
      fixture.destroy();
    }
  });
});
