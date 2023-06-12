import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ArticlesComponent } from "./articles.component";
import { ArticlesResolver } from "./resolvers/articles.resolver";

const routes: Routes = [
  {
    path: '',
    component: ArticlesComponent,
    resolve: {
      articles: ArticlesResolver
    }
  }
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticlesRoutingModule {}
