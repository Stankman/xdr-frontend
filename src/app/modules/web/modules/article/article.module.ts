import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ArticleComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class ArticleModule { }
