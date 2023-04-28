import { ApiPagination } from "../api/api-pagination.model";
import { Payment } from "./payment.model";

export class PaymentPagination extends ApiPagination {
    override data: Payment[];
}