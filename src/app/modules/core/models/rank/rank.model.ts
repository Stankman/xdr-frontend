import { User } from "../user/user.model";

export class Rank {
    id: number;
    rank_name: string;
    badge: string;
    prefix: string;
    prefix_color: string;
    users?: User[];
    busy?: boolean;
}