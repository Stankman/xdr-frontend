import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
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
import { DateFnsModule } from "ngx-date-fns";
import { environment } from "src/environments/environment";
import { LanguageService } from "./modules/shared/services/language.service";

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
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    private translateService: TranslateService, 
    private languageService: LanguageService
  ) {
    this.translateService.addLangs(['es', 'en']);

    this.translateService.setDefaultLang(environment.app.defaultLang);

    if (this.translateService.getLangs().indexOf(this.languageService.language) === -1)
    {
      this.languageService.language = environment.app.defaultLang;
    }

    this.translateService.use(this.languageService.language);
  }
}
