import { Avatar } from "../avatar/avatar.model";

export class Article {
    id!: number;
    title!: string;
    slug?: string;
    description!: string;
    content!: string;
    image!: string;
    thumbnail!: string;
    comments?: number;
    author?: Avatar;
    likes?: number;
    dislikes?: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    pinned!: boolean;
    hidden!: boolean;
}