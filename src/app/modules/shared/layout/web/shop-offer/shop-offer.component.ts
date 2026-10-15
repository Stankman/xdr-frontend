import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Offer } from 'src/app/modules/core/models/shop/offer.model';

@Component({
    selector: 'xdr-shop-offer',
    templateUrl: './shop-offer.component.html',
    styleUrls: ['./shop-offer.component.scss'],
    providers: [DialogService],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShopOfferComponent {
  private _offer: Offer;
  
  constructor(
    private readonly dialogService : DialogService
  ) {}

  @Input('offer')
  public set offer(value: Offer) {
    this._offer = value;
  }

  public get offer(): Offer {
    return this._offer;
  }

  public async showDetails() : Promise<void> {
    const { ShopOfferDetailsComponent } = await import('../shop-offer-details/shop-offer-details.component');
    const ref = this.dialogService.open(ShopOfferDetailsComponent, {
      header: 'Details', //TODO translate
      width: '70%',
      modal: true,
      dismissableMask: true,
      maximizable: true,
      data: {
        offer: this.offer
      }
    });
  }
}
