import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AcpWorkspaceComponent } from '../../../shared/layout/acp/workspace/workspace.component';
import { CatalogPageComponent, CatalogPagesComponent, FurnitureDefinitionComponent, FurnitureDefinitionsComponent } from './catalog.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', pathMatch: 'full', redirectTo: 'pages' },
    { path: 'pages', component: CatalogPagesComponent, data: { pageLabel: 'Catalog Pages' } },
    { path: 'pages/:id', component: CatalogPageComponent, data: { pageLabel: 'Catalog Pages', detail: true } },
    { path: 'featured', component: AcpWorkspaceComponent, data: { pageLabel: 'Catalog Featured Pages' } },
    { path: 'furniture', component: FurnitureDefinitionsComponent, data: { pageLabel: 'Furniture Definitions' } },
    { path: 'furniture/:id', component: FurnitureDefinitionComponent, data: { pageLabel: 'Furniture Definitions', detail: true } }
  ])]
})
export class CatalogModule {}
