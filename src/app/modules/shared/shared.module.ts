import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from '@angular/router';

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
import { SummaryComponent } from './layout/web/summary/summary.component';
import { ShopOfferComponent } from './layout/web/shop-offer/shop-offer.component';
import { PurseComponent } from './layout/web/purse/purse.component';
import { VoucherComponent } from './layout/web/voucher/voucher.component';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { SelectModule } from 'primeng/select';
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TranslateModule } from "@ngx-translate/core";

import { DateFnsModule } from "ngx-date-fns";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DateFnsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),

    AvatarModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    CheckboxModule,
    DividerModule,
    SelectModule,
    DynamicDialogModule,
    InputTextModule,
    MenubarModule,
    PasswordModule,
    RippleModule,
    ScrollerModule,
    SkeletonModule,
    TabsModule,
    ToastModule,
    ToggleButtonModule
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
    PurseComponent,
    RankCardComponent,
    RankMemberComponent,
    RecentUsersComponent,
    SignInDialogComponent,
    ShopOfferComponent,
    SummaryComponent,
    VoucherComponent
  ],
  exports: [
    ArticlesCarouselComponent,
    ArticlePreviewComponent,
    ArticleSlideComponent,
    EmptyBlockComponent,
    FooterComponent,
    HeaderComponent,
    InfoBlockComponent,
    ListMemberComponent,
    PurseComponent,
    RankCardComponent,
    RankMemberComponent,
    RecentUsersComponent,
    SignInDialogComponent,
    ShopOfferComponent,
    SummaryComponent,
    VoucherComponent,

    AvatarModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    CheckboxModule,
    SelectModule,
    DynamicDialogModule,
    InputTextModule,
    MenubarModule,
    PasswordModule,
    RippleModule,
    ScrollerModule,
    SkeletonModule,
    TabsModule,
    ToastModule
  ]
})
export class SharedModule { }
