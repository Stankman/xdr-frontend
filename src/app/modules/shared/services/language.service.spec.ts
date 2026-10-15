import { TranslateService } from '@ngx-translate/core';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let translate: jasmine.SpyObj<TranslateService>;
  let dates: jasmine.SpyObj<DateFnsConfigurationService>;
  beforeEach(() => {
    translate = jasmine.createSpyObj('TranslateService', ['use', 'addLangs', 'setDefaultLang']);
    dates = jasmine.createSpyObj('DateFnsConfigurationService', ['setLocale']);
  });
  afterEach(() => localStorage.removeItem('xdr-lang'));

  it('normalizes stored regional locales and initializes dates', () => {
    localStorage.setItem('xdr-lang', 'en-US');
    const service = new LanguageService(translate, dates);
    expect(service.language).toBe('en');
    expect(service.getCurrentCulture()).toBe('en-US');
    expect(document.documentElement.lang).toBe('en');
    expect(dates.setLocale).toHaveBeenCalled();
    service.language = 'es-MX';
    expect(service.language).toBe('es');
    expect(service.getCurrentCulture()).toBe('es-ES');
    expect(document.documentElement.lang).toBe('es');
    expect(translate.use).toHaveBeenCalledWith('es');
    expect(localStorage.getItem('xdr-lang')).toBe('es');
  });
});
