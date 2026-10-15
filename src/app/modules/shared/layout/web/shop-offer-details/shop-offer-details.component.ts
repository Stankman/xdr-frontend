import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ICancelCallbackData, ICreateOrderRequest, IOnApproveCallbackData, IOrderDetails, IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { firstValueFrom } from 'rxjs';
import { ShopService } from '../../../services/shop.service';
import { Offer } from 'src/app/modules/core/models/shop/offer.model';
import { environment } from 'src/environments/environment';

export interface PaymentActions {
  order: {
    get(): Promise<IOrderDetails>;
    capture(): Promise<IOrderDetails>;
  };
}

@Component({
  selector: 'xdr-shop-offer-details',
  templateUrl: './shop-offer-details.component.html',
  styleUrls: ['./shop-offer-details.component.scss'],
  imports: [CommonModule, NgxPayPalModule],
  changeDetection: ChangeDetectionStrategy.Eager
})
export class ShopOfferDetailsComponent implements OnInit {
  public offer: Offer;
  public payPalConfig: IPayPalConfig;
  private recordedOrder: string | null = null;
  private processing = false;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly config: DynamicDialogConfig,
    private readonly messages: MessageService,
    private readonly shop: ShopService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.offer = this.config.data.offer;
    this.payPalConfig = {
      clientId: environment.app.PayPal.clientId,
      currency: this.offer.currency,
      createOrderOnClient: (): ICreateOrderRequest => ({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: this.offer.id.toString(),
          amount: {
            currency_code: this.offer.currency,
            value: this.offer.price,
            breakdown: { item_total: { currency_code: this.offer.currency, value: this.offer.price } }
          },
          items: [{
            name: this.offer.title, quantity: '1',
            unit_amount: { value: this.offer.price, currency_code: this.offer.currency }
          }]
        }]
      }),
      onApprove: (data, actions: PaymentActions) => { void this.captureOrder(data, actions); },
      onCancel: data => { void this.cancelOffer(data); },
      onError: () => this.failedOffer()
    };
  }

  private async captureOrder(data: IOnApproveCallbackData, actions: PaymentActions): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    try {
      const order = await actions.order.get();
      if (!order.id || order.id !== data.orderID || !order.payer?.payer_id) {
        throw new Error('Invalid PayPal order details.');
      }
      await firstValueFrom(this.shop.makePayment({
        offerId: this.offer.id, orderId: order.id,
        payerId: order.payer.payer_id, status: order.status
      }));
      this.recordedOrder = order.id;
      this.messages.add({ severity: 'info', summary: this.translate.instant('PAYMENT.PROCESSING') });
      const captured = await actions.order.capture();
      if (captured.id !== order.id || captured.status !== 'COMPLETED') {
        throw new Error('PayPal capture was not completed.');
      }
      await firstValueFrom(this.shop.updatePaymentStatus({ orderId: captured.id, status: captured.status }));
      this.messages.add({ severity: 'success', summary: this.translate.instant('PAYMENT.SUCCESS') });
      this.ref.close();
    } catch (error) {
      this.failedOffer();
    } finally {
      this.processing = false;
    }
  }

  private async cancelOffer(data: ICancelCallbackData): Promise<void> {
    try {
      if (this.recordedOrder && data.orderID === this.recordedOrder) {
        await firstValueFrom(this.shop.updatePaymentStatus({ orderId: data.orderID, status: 'CANCELLED' }));
      }
      this.messages.add({ severity: 'warn', summary: this.translate.instant('PAYMENT.CANCELLED') });
      this.ref.close();
    } catch (error) {
      this.failedOffer();
    }
  }

  private failedOffer(): void {
    this.messages.add({ severity: 'error', summary: this.translate.instant('PAYMENT.ERROR') });
    this.ref.close();
  }
}
