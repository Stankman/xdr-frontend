import { Injectable } from "@angular/core";
import { OfferPagination } from "../../core/models/shop/offer-pagination.model";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ShopService } from "../services/shop.service";

@Injectable({ providedIn: 'root'})
export class OffersResolver {
    constructor(
        private readonly shopService : ShopService
    ) {}

    resolve(route : ActivatedRouteSnapshot) : Observable<OfferPagination> {
        return this.shopService.getPaginatedOffers(1,10);
    }
}