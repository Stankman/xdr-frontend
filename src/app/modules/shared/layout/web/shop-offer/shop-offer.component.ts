import { Component, Input } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { Offer } from 'src/app/modules/core/models/shop/offer.model';
import { ShopOfferDetailsComponent } from '../shop-offer-details/shop-offer-details.component';

@Component({
  selector: 'xdr-shop-offer',
  templateUrl: './shop-offer.component.html',
  styleUrls: ['./shop-offer.component.scss'],
  providers: [DialogService]
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

  public showDetails() : void {
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
