import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ShopService } from '../../../services/shop.service';
import { Offer } from 'src/app/modules/core/models/shop/offer.model';
import { ICreateOrderRequest, IOrderDetails, IPayPalConfig } from 'ngx-paypal';
import { Message, MessageService } from 'primeng/api';
import { Payment } from 'src/app/modules/core/models/shop/payment.model';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../../services/account.service';

@Component({
  selector: 'xdr-shop-offer-details',
  templateUrl: './shop-offer-details.component.html',
  styleUrls: ['./shop-offer-details.component.scss']
})
export class ShopOfferDetailsComponent implements OnInit {
  
  public offer : Offer;
  public payPalConfig : IPayPalConfig;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly messageService : MessageService,
    private readonly shopService : ShopService,
    private readonly accountService : AccountService
  ) {}

  ngOnInit(): void {
    this.offer = this.config.data.offer;
    this.loadPayPalConfig();
  }

  private loadPayPalConfig(): void {
    this.payPalConfig = {
      clientId: environment.app.PayPal.clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: this.offer.id.toString(),
          amount: {
            currency_code: this.offer.currency,
            value: this.offer.price,
            breakdown: {
              item_total: {
                currency_code: this.offer.currency,
                value: this.offer.price
              }
            }
          },
          items: [
            {
              name: this.offer.title,
              quantity: '1',
              unit_amount: {
                value: this.offer.price,
                currency_code: this.offer.currency
              }
            }
          ]
        }]
      },
      onApprove: (data, actions) => this.captureOrder(data, actions),
      onClientAuthorization: (data) => this.authorizedOffer(data),
      onCancel: (data) => this.cancelOffer(data),
      onError: (err) => this.failedOffer(err)
    }
  }

  private captureOrder(data : any, actions : any): void {
    actions.order.get().then((details : IOrderDetails) => {
      const payment : Payment = {
        offerId: Number.parseInt(details.purchase_units[0].reference_id),
        orderId: details.id,
        payerId: details.payer.payer_id,
        status: details.status
      };

      this.shopService.makePayment(payment).subscribe({
        next: () => {
          const message : Message = {
            severity: 'warning',
            summary: 'Processing',
            detail: 'We are preparing your order'
          }
          this.messageService.add(message);
        }
      });
    });
  }

  private authorizedOffer(details): void {
    const message : Message = {
      severity: 'success',
      summary: 'Done!',
      detail: `${ this.offer.title }' purchased successfully!`
    };

    const paymentStatus : any = {
      orderId: details.id,
      status: details.status
    };

    this.shopService.updatePaymentStatus(paymentStatus).subscribe({
      next: () => {
        this.messageService.add(message);
      },
      error: () => {
        message.severity = 'error';
        message.summary = 'Error';
        message.detail = 'Something happened when updating your payment.'
        this.messageService.add(message);
      },
      complete: () => this.ref.close()
    });
  }

  private cancelOffer(details : any): void {
    const message: Message = {
      severity: 'error',
      summary: 'Oops!',
      detail: 'Purchase has been cancelled'
    };

    const paymentStatus: any = {
      order_id: details.id,
      status: details.status
    };

    this.shopService.updatePaymentStatus(paymentStatus).subscribe({
      next: () => {
        this.messageService.add(message);
      },
      complete: () => this.ref.close()
    });
  }

  private failedOffer(err : any): void {
    const message: Message = {
      severity: 'error',
      summary: 'Oops!',
      detail: 'An error has occurred during purchase process.'
    };
    this.messageService.add(message);
    this.ref.close(this.offer);
  }
}
