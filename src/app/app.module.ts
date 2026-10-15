import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { LOCALE_ID, NgModule, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { registerLocaleData } from '@angular/common';
import localeENUS from '@angular/common/locales/en';
import localeESES from '@angular/common/locales/es';
import { QuicklinkModule } from 'ngx-quicklink';
import { DateFnsConfigurationService } from 'ngx-date-fns';
import { firstValueFrom } from 'rxjs';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LanguageService } from './modules/shared/services/language.service';
import { AccountService } from './modules/shared/services/account.service';
import { AlertsComponent } from './modules/shared/layout/alerts/alerts.component';
import { ServerErrorInterceptor } from './interceptors/server-error.interceptor';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ClientModule } from './modules/client/client.module';
import { primeUILicense } from '../primeui-license.local';

registerLocaleData(localeENUS);
registerLocaleData(localeESES);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useFactory: HttpLoaderFactory, deps: [HttpClient] }
    }),
    QuicklinkModule, AppRoutingModule, ClientModule, AlertsComponent
  ],
  providers: [
    MessageService,
    provideZoneChangeDetection(),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    providePrimeNG({
      license: primeUILicense,
      ripple: true,
      theme: { preset: Aura, options: { darkModeSelector: 'body.dark', cssLayer: { name: 'primeng', order: 'theme, base, primeng, components, utilities' } } }
    }),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useFactory: (language: LanguageService) => language.getCurrentCulture(), deps: [LanguageService] },
    DateFnsConfigurationService,
    provideAppInitializer(() => {
      const language = inject(LanguageService);
      const accounts = inject(AccountService);
      return firstValueFrom(language.load()).then(() => firstValueFrom(accounts.restoreSession()));
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
