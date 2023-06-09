export class Payment {
    id? : number;
    avatarId? : number;
    offerId : number;
    orderId : string;
    payerId : string;
    status : string;
    delivered? : string;
}