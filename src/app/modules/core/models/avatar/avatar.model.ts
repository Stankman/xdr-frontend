import { Timestamp } from "../misc/timestamp.model";
import { Role } from "../role/role.model";
import { AvatarCurrency } from "./avatar-currency.model";

export class Avatar {
    id!: number;
    username!: string;
    mail!: string;
    motto!: string;
    credits!: number;
    currencies!: AvatarCurrency[];
    look!: string;
    online!: string;
    rank!: number;
    role? : Role;
    ip_current?: string;
    ip_register?: string;
    last_online!: number;
    lastLogin!: number;
    created_at!: Date;
    updated_at?: Timestamp;
    leaderboardPoint?: number;
}