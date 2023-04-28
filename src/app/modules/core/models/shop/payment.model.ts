import { Timestamp } from '../timestamp.model';

export class Payment {
    id? : number;
    user_id : number;
    offer_id : string;
    order_id : string;
    payer_id : string;
    status : string;
    delivered? : string;
    timestamp? : string;
}