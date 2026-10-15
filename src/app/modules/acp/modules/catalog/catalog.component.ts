import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';

@Component({
  selector: 'xdr-acp-catalog-pages',
  imports: [AcpTableComponent],
  template: `<xdr-acp-table heading="Catalog Pages" demoPath="catalog/pages" [columns]="['ACP.ID', 'ACP.NAME', 'hidden']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogPagesComponent {}

@Component({
  selector: 'xdr-acp-catalog-page',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record demoPath="catalog/pages" [fields]="['ACP.ID', 'ACP.NAME', 'hidden']"
    [collections]="['ACP.CHILD_PAGES', 'ACP.OFFERS']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogPageComponent {}

@Component({
  selector: 'xdr-acp-furniture-definitions',
  imports: [AcpTableComponent],
  template: `<xdr-acp-table heading="Furniture Definitions" demoPath="catalog/furniture" [columns]="['ACP.ID', 'ACP.NAME', 'ACP.LOGIC']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FurnitureDefinitionsComponent {}

@Component({
  selector: 'xdr-acp-furniture-definition',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record demoPath="catalog/furniture" [fields]="['ACP.ID', 'ACP.NAME', 'ACP.LOGIC']"
    [collections]="['ACP.ALL_RECORD_DATA', 'ACP.ASSOCIATED_OFFER', 'Catalog Pages']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FurnitureDefinitionComponent {}
