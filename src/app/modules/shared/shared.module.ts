import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ArticlesCarouselComponent } from './layout/web/articles-carousel/articles-carousel.component';
import { ArticleSlideComponent } from './layout/web/article-slide/article-slide.component';
import { FooterComponent } from "./layout/web/footer/footer.component";
import { HeaderComponent } from "./layout/web/header/header.component";
import { ListMemberComponent } from "./layout/web/list-member/list-member.component";
import { RecentUsersComponent } from './layout/web/recent-users/recent-users.component';
import { SignInDialogComponent } from "./layout/web/signin-dialog/signin-dialog.component";

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
    VirtualScrollerModule
  ],
  declarations: [
    ArticlesCarouselComponent,
    ArticleSlideComponent,
    FooterComponent,
    HeaderComponent,
    ListMemberComponent,
    RecentUsersComponent,
    SignInDialogComponent
  ],
  exports: [
    ArticlesCarouselComponent,
    FooterComponent,
    HeaderComponent,
    RecentUsersComponent,
    SignInDialogComponent,

    AvatarModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    DropdownModule,
    DynamicDialogModule,
    InputTextModule,
    MenubarModule,
    RippleModule
  ]
})
export class SharedModule { }
