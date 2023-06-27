import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientComponent } from "./client.component";
import { ClientResolver } from './resolvers/client.resolver';

const routes : Routes = [
    {
        path: '',
        component: ClientComponent,
        resolve: {
            ClientResolver
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule {}