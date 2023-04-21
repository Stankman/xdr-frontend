import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { SignInDialogComponent } from './layout/web/signin-dialog/signin-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    CarouselModule,
    DynamicDialogModule,
    MenubarModule,
    RippleModule
  ],
  declarations: [
    SignInDialogComponent
  ],
  exports: [
    SignInDialogComponent,

    ButtonModule,
    CardModule,
    CarouselModule,
    DynamicDialogModule,
    MenubarModule,
    RippleModule
  ]
})
export class SharedModule { }
