import { Room } from "../room/room.model";
import { User } from "../user/user.model";

export class Guild {
    id: number;
    user: User;
    name: string;
    description: string;
    badge: string;
    date_created: number;
    room: Room;
    member_count: number;
}