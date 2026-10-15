import { Component, NgModule, ChangeDetectionStrategy } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ClientResolver } from './resolvers/client.resolver';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.Eager,
 standalone: true })
export class ClientRouteComponent {}

const routes : Routes = [
    {
        path: '',
        component: ClientRouteComponent,
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