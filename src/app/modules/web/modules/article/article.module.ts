import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ArticleComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ArticleRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class ArticleModule { }
