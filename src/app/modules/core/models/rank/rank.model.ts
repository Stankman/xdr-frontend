import { Avatar } from "primeng/avatar";

export class Rank {
    id!: number;
    rank_name!: string;
    badge!: string;
    prefix!: string;
    prefix_color!: string;
    avatars: Avatar[] = [];
    busy?: boolean;
}