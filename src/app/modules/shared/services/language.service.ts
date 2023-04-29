import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLangSubject: BehaviorSubject<string>;
  public currentLanguage : Observable<string>;

  constructor(private translateService : TranslateService)
  {
    if(!localStorage.getItem("xdr-lang"))
    {
      localStorage.setItem('xdr-lang', navigator.language);
    }

    this.currentLangSubject = new BehaviorSubject<string>(localStorage.getItem('xdr-lang')!);
    this.currentLanguage = this.currentLangSubject.asObservable();
  }

  set language(lang: string) {
    this.currentLangSubject.next(lang);
    this.translateService.use(lang);
    localStorage.setItem('xdr-lang', lang);
  }

  get language(): string {
    return this.currentLangSubject.value;
  }

  public getCurrentCulture(): string {
    switch (this.language) {
      case 'es':
        return 'es-ES';
      default:
      case 'en':
        return 'en-US';
    }
  }
}