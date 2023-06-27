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
import { SummaryComponent } from './layout/web/summary/summary.component';
import { ShopOfferComponent } from './layout/web/shop-offer/shop-offer.component';
import { PurseComponent } from './layout/web/purse/purse.component';
import { VoucherComponent } from './layout/web/voucher/voucher.component';
import { ShopOfferDetailsComponent } from './layout/web/shop-offer-details/shop-offer-details.component';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogModule } from "primeng/dynamicdialog";
import { EditorModule } from 'primeng/editor';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { ScrollerModule } from 'primeng/scroller';
import { SkeletonModule } from 'primeng/skeleton';
import { TabViewModule } from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { VirtualScrollerModule } from 'primeng/virtualscroller';
import { TranslateModule } from "@ngx-translate/core";

import { NgxPayPalModule } from "ngx-paypal";
import { DateFnsModule } from "ngx-date-fns";
import { ClientButtonsComponent } from './layout/client/client-buttons/client-buttons.component';
import { ClientNitroComponent } from './layout/client/client-nitro/client-nitro.component';

@NgModule({
  imports: [
    CommonModule,
    DateFnsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NgxPayPalModule,

    AvatarModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    CheckboxModule,
    DividerModule,
    DropdownModule,
    DynamicDialogModule,
    EditorModule,
    InputTextModule,
    MenubarModule,
    PasswordModule,
    RippleModule,
    ScrollerModule,
    SkeletonModule,
    TabViewModule,
    ToastModule,
    ToggleButtonModule,
    VirtualScrollerModule
  ],
  declarations: [
    ArticlesCarouselComponent,
    ArticlePreviewComponent,
    ArticleSlideComponent,
    ClientButtonsComponent,
    ClientNitroComponent,
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
    ShopOfferDetailsComponent
  ],
  exports: [
    ArticlesCarouselComponent,
    ArticlePreviewComponent,
    ArticleSlideComponent,
    ClientButtonsComponent,
    ClientNitroComponent,
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
    DropdownModule,
    DynamicDialogModule,
    EditorModule,
    InputTextModule,
    MenubarModule,
    PasswordModule,
    RippleModule,
    ScrollerModule,
    SkeletonModule,
    TabViewModule,
    ToastModule,
    VirtualScrollerModule
  ]
})
export class SharedModule { }
