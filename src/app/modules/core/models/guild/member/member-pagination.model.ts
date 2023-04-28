import { ApiPagination } from "../../api/api-pagination.model";
import { Member } from "./member.model";

export class MemberPagination extends ApiPagination {
    override data: Member[];
}