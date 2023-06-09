import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopRoutingModule } from './shop-routing.module';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ShopComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ShopRoutingModule,
    SharedModule
  ]
})
export class ShopModule { }
