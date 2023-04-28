import { ApiPagination } from "../api/api-pagination.model";
import { Friend } from "./friend.model";

export class FriendPagination extends ApiPagination {
    override data: Friend[];
}