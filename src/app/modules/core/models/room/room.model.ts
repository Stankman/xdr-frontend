import { Guild } from "../guild/guild.model";
import { User } from "../user/user.model";

export class Room {
    id: number;
    name: string;
    description: string;
    state: string;
    users: number;
    score: number;
    user: User;
    guild?: Guild;
    users_max: number;
}