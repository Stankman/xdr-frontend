import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ShopComponent } from "./shop.component";
import { OffersResolver } from "src/app/modules/shared/resolvers/offers.resolver";

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    resolve: {
      offers: OffersResolver
    }
  }
];
  
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule {}
