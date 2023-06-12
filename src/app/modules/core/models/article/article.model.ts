import { Avatar } from "primeng/avatar";

export class Article {
    id: number;
    title: string;
    slug?: string;
    description: string;
    content: string;
    image: string;
    thumbnail: string;
    comments?: number;
    avatar?: Avatar;
    likes?: number;
    dislikes?: number;
    created_at?: string;
    updated_at?: string;
    pinned: number;
    hidden: number;
}