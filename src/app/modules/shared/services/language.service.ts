import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import { es, enUS } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private currentLangSubject: BehaviorSubject<string>;
  public currentLanguage : Observable<string>;

  constructor(
    private readonly translateService: TranslateService,
    private readonly dateFnsConfigService: DateFnsConfigurationService
  )
  {
    if(!localStorage.getItem("xdr-lang"))
    {
      localStorage.setItem('xdr-lang', this.normalize(navigator.language));
    }

    this.currentLangSubject = new BehaviorSubject<string>(this.normalize(localStorage.getItem('xdr-lang')!));
    this.currentLanguage = this.currentLangSubject.asObservable();
    localStorage.setItem('xdr-lang', this.language);
    document.documentElement.lang = this.language;
    this.updateDateFns();
  }

  set language(lang: string) {
    lang = this.normalize(lang);
    this.currentLangSubject.next(lang);
    this.translateService.use(lang);
    localStorage.setItem('xdr-lang', lang);
    this.updateDateFns();
    document.documentElement.lang = lang;
  }

  private normalize(lang: string): string {
    const language = lang.toLowerCase().split(/[-_]/)[0];
    return language === 'en' || language === 'es' ? language : 'es';
  }

  public load(): Observable<unknown> {
    this.translateService.addLangs(['es', 'en']);
    this.translateService.setDefaultLang('en');
    return this.translateService.use(this.language);
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

  public updateDateFns() : void {
    switch(this.language) {
      case 'es':
        return this.dateFnsConfigService.setLocale(es);
      case 'en':
      default:
        return this.dateFnsConfigService.setLocale(enUS);
    }
  }
}