import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from "@angular/common/http";
import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { registerLocaleData } from "@angular/common";
import localeENUS from '@angular/common/locales/en';
import localeESES from '@angular/common/locales/es';
import { QuicklinkModule } from "ngx-quicklink";
import { DateFnsConfigurationService, DateFnsModule } from "ngx-date-fns";
import { environment } from "src/environments/environment";
import { LanguageService } from "./modules/shared/services/language.service";
import { SharedModule } from "./modules/shared/shared.module";
import { ServerErrorInterceptor } from "./interceptors/server-error.interceptor";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { MessageService } from "primeng/api";
import { ClientModule } from "./modules/client/client.module";

registerLocaleData(localeENUS);
registerLocaleData(localeESES);

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DateFnsModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    QuicklinkModule,
    AppRoutingModule,
    ClientModule,
    SharedModule
  ],
  providers: [
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
    {
      provide: LOCALE_ID,
      useFactory: (languageService) => languageService.getCurrentCulture(),
      deps: [LanguageService],
    },
    DateFnsConfigurationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private readonly translateService: TranslateService, 
    private readonly languageService: LanguageService
  ) {
    this.translateService.addLangs(['es', 'en']);

    this.translateService.setDefaultLang(environment.app.defaultLang);

    if (this.translateService.getLangs().indexOf(this.languageService.language) === -1)
    {
      this.languageService.language = environment.app.defaultLang;
      this.languageService.updateDateFns();
    }

    this.translateService.use(this.languageService.language);
  }
}
