import { ApiPagination } from "../api/api-pagination.model";
import { Offer } from "./offer.model";

export class OfferPagination extends ApiPagination {
    override items: Offer[]
}