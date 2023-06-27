import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule } from "@ngx-translate/core";
import { NotFoundRoutingModule } from "./not-found-routing.module";
import { NotFoundComponent } from "./not-found.component";
import { SharedModule } from "../../../shared/shared.module";

@NgModule({
    imports: [
      CommonModule,
      TranslateModule.forChild(),
      SharedModule,
      NotFoundRoutingModule
    ],
    declarations: [NotFoundComponent]
  })
  export class NotFoundModule { }