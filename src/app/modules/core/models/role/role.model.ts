import { Rank } from "../rank/rank.model";

export class Role {
    id!: number;
    name!: string;
    description!: string;
    status!: boolean;
    children? : Role[];
    rank? : Rank;
    permissions? : string[];
}