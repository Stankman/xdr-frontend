import { User } from "../user/user.model";

export class Friend extends User {
    friend: User;
    relation: number;
    friends_since: number;
}