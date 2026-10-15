import { fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { IOrderDetails } from 'ngx-paypal';
import { of, Subject } from 'rxjs';
import { ShopOfferDetailsComponent } from './shop-offer-details.component';
import { ShopService } from '../../../services/shop.service';
import { Payment } from 'src/app/modules/core/models/shop/payment.model';

describe('Payment callback coordination', () => {
  let component: ShopOfferDetailsComponent;
  let shop: jasmine.SpyObj<ShopService>;
  let messages: jasmine.SpyObj<MessageService>;
  let ref: jasmine.SpyObj<DynamicDialogRef>;
  const order: IOrderDetails = {
    id: 'order-1', status: 'APPROVED', intent: 'CAPTURE',
    create_time: '', update_time: '', payer: { payer_id: 'payer-1' }, links: [], purchase_units: []
  };
  const approval = { orderID: 'order-1', payerID: 'payer-1', subscriptionID: '' };

  beforeEach(() => {
    shop = jasmine.createSpyObj('ShopService', ['makePayment', 'updatePaymentStatus']);
    shop.makePayment.and.returnValue(of(new Payment()));
    shop.updatePaymentStatus.and.returnValue(of(new Payment()));
    messages = jasmine.createSpyObj('MessageService', ['add']);
    ref = jasmine.createSpyObj('DynamicDialogRef', ['close']);
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.callFake(key => key);
    component = new ShopOfferDetailsComponent(ref, Object.assign(new DynamicDialogConfig(), {
      data: { offer: { id: 1, title: 'Fixture', currency: 'EUR', price: '2.00' } }
    }), messages, shop, translate);
    component.ngOnInit();
  });

  it('creates the record before capture and updates only after capture', fakeAsync(() => {
    const record = new Subject<Payment>();
    shop.makePayment.and.returnValue(record);
    const capture = jasmine.createSpy('capture').and.returnValue(Promise.resolve({ ...order, status: 'COMPLETED' }));
    component.payPalConfig.onApprove(approval, { order: { get: () => Promise.resolve(order), capture } });
    flushMicrotasks();
    expect(shop.makePayment).toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
    record.next(new Payment());
    record.complete();
    flushMicrotasks();
    expect(capture).toHaveBeenCalledTimes(1);
    expect(shop.updatePaymentStatus).toHaveBeenCalledWith({ orderId: 'order-1', status: 'COMPLETED' });
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success' }));
    expect(ref.close).toHaveBeenCalled();
    expect(component.payPalConfig.currency).toBe('EUR');
  }));

  it('does not capture when recording fails', fakeAsync(() => {
    const record = new Subject<Payment>();
    shop.makePayment.and.returnValue(record);
    const capture = jasmine.createSpy('capture');
    component.payPalConfig.onApprove(approval, { order: { get: () => Promise.resolve(order), capture } });
    flushMicrotasks();
    record.error(new Error('Unavailable'));
    flushMicrotasks();
    expect(capture).not.toHaveBeenCalled();
    expect(shop.updatePaymentStatus).not.toHaveBeenCalled();
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error' }));
  }));

  it('handles cancellation before any record exists without an invalid update', fakeAsync(() => {
    component.payPalConfig.onCancel({ orderID: 'order-1' }, {});
    flushMicrotasks();
    expect(shop.updatePaymentStatus).not.toHaveBeenCalled();
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'warn' }));
    expect(ref.close).toHaveBeenCalled();
  }));
});
