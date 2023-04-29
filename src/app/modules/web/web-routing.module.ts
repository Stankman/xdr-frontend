import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes : Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/login/login.module').then((m) => m.LoginModule)
    },
    {
        path: 'registration',
        loadChildren: () => import('./modules/register/register.module').then((m) => m.RegisterModule)
    },
    {
        path: 'me',
        loadChildren: () => import('./modules/home/home.module').then((m) => m.HomeModule)
    },
    {
        path: 'community',
        loadChildren: () => import('./modules/community/community.module').then((m) => m.CommunityModule)
    },
    {
        path: 'article',
        loadChildren: () => import('./modules/article/article.module').then((m) => m.ArticleModule)
    },
    {
        path: 'articles',
        loadChildren: () => import('./modules/articles/articles.module').then((m) => m.ArticlesModule)
    },
    {
        path: 'team',
        loadChildren: () => import('./modules/team/team.module').then((m) => m.TeamModule)
    },
    {
        path: 'hall-of-fame',
        loadChildren: () => import('./modules/hall-of-fame/hall-of-fame.module').then((m) => m.HallOfFameModule)
    },
    {
        path: 'shop',
        loadChildren: () => import('./modules/shop/shop.module').then((m) => m.ShopModule)
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class WebRoutingModule {}