import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, map } from "rxjs";
import { OfferPagination } from "../../core/models/shop/offer-pagination.model";
import { HttpParams } from "@angular/common/http";
import { Api } from "../../core/models/api/api.model";
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

        return this.apiService.get(`shop/offers/all`, { params: params }).pipe(
            map((resp: Api) => resp.data)
        );
    }

    public makePayment(payment : Payment) : Observable<Payment> {
        return this.apiService.post(`shop/purchase`, payment).pipe(
            map((resp: Api) => resp.data)
        );
    }

    public updatePaymentStatus(paymentStatus : any) : Observable<Payment> {
        return this.apiService.put(`shop/purchase`, paymentStatus).pipe(
            map((resp: Api) => resp.data)
        );
    }
}