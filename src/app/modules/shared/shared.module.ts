import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ArticlesCarouselComponent } from './layout/web/articles-carousel/articles-carousel.component';
import { ArticlePreviewComponent } from './layout/web/article-preview/article-preview.component';
import { ArticleSlideComponent } from './layout/web/article-slide/article-slide.component';
import { EmptyBlockComponent } from './layout/web/empty-block/empty-block.component';
import { FooterComponent } from "./layout/web/footer/footer.component";
import { HeaderComponent } from "./layout/web/header/header.component";
import { InfoBlockComponent } from './layout/web/info-block/info-block.component';
import { ListMemberComponent } from "./layout/web/list-member/list-member.component";
import { RankCardComponent } from './layout/web/rank-card/rank-card.component';
import { RankMemberComponent } from './layout/web/rank-member/rank-member.component';
import { RecentUsersComponent } from './layout/web/recent-users/recent-users.component';
import { SignInDialogComponent } from "./layout/web/signin-dialog/signin-dialog.component";
import { SimpleHeaderComponent } from './layout/web/simple-header/simple-header.component';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ScrollerModule } from 'primeng/scroller';
import { TabViewModule } from 'primeng/tabview';
import { VirtualScrollerModule } from 'primeng/virtualscroller';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AvatarModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    DividerModule,
    DropdownModule,
    DynamicDialogModule,
    InputTextModule,
    MenubarModule,
    PasswordModule,
    RippleModule,
    ScrollerModule,
    TabViewModule,
    VirtualScrollerModule
  ],
  declarations: [
    ArticlesCarouselComponent,
    ArticlePreviewComponent,
    ArticleSlideComponent,
    EmptyBlockComponent,
    FooterComponent,
    HeaderComponent,
    InfoBlockComponent,
    ListMemberComponent,
    RankCardComponent,
    RankMemberComponent,
    RecentUsersComponent,
    SignInDialogComponent,
    SimpleHeaderComponent
  ],
  exports: [
    ArticlesCarouselComponent,
    ArticlePreviewComponent,
    EmptyBlockComponent,
    FooterComponent,
    HeaderComponent,
    InfoBlockComponent,
    RankCardComponent,
    RecentUsersComponent,
    SignInDialogComponent,
    SimpleHeaderComponent,

    AvatarModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    DropdownModule,
    DynamicDialogModule,
    InputTextModule,
    MenubarModule,
    RippleModule,
    ScrollerModule,
    TabViewModule,
    VirtualScrollerModule
  ]
})
export class SharedModule { }
