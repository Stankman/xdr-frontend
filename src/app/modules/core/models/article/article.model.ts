import { Avatar } from "../avatar/avatar.model";

export class Article {
    id: number;
    title: string;
    slug?: string;
    description: string;
    content: string;
    image: string;
    thumbnail: string;
    comments?: number;
    author?: Avatar;
    likes?: number;
    dislikes?: number;
    createdAt?: Date;
    updatedAt?: Date;
    pinned: number;
    hidden: number;
}