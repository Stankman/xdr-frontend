import { ApiPagination } from "../api/api-pagination.model";
import { Rank } from "./rank.model";

export class RankPagination extends ApiPagination {
    override data: Rank[];
}