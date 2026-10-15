import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, map } from "rxjs";
import { OfferPagination } from "../../core/models/shop/offer-pagination.model";
import { Payment } from "../../core/models/shop/payment.model";

@Injectable({ providedIn: 'root'})
export class ShopService {
    constructor(
        private readonly apiService : ApiService
    ) {}

    public getPaginatedOffers(page: number = 1, limit: number = 10) : Observable<OfferPagination> {
        const params = {
            page,
            limit
        };

        return this.apiService.get<OfferPagination>(`shop/offers/all`, { params: params }).pipe(
            map((resp) => resp.data)
        );
    }

    public makePayment(payment : Payment) : Observable<Payment> {
        return this.apiService.post<Payment>(`shop/purchase`, payment).pipe(
            map((resp) => resp.data)
        );
    }

    public updatePaymentStatus(paymentStatus : { orderId: string; status: string }) : Observable<Payment> {
        return this.apiService.put<Payment>(`shop/purchase`, paymentStatus).pipe(
            map((resp) => resp.data)
        );
    }
}