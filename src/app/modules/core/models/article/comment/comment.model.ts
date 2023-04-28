import { User } from "../../user/user.model";

export class Comment {
    id: number;
    user: User;
    content: string;
    likes: number;
    dislikes: number;
    is_edited: number;
    created_at: string;
    updated_at: number;
}
  