import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { OfferPagination } from 'src/app/modules/core/models/shop/offer-pagination.model';

@Component({
    selector: 'xdr-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShopComponent implements OnInit {
  public dataSource : OfferPagination;

  constructor(
    private readonly translateService: TranslateService,
    private readonly route: ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.dataSource = this.route.snapshot.data['offers'];
  }
}
