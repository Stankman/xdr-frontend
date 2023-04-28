import { ApiPagination } from "../../api/api-pagination.model";
import { Comment } from './comment.model';

export class CommentPagination extends ApiPagination {
    override data: Comment[];
}