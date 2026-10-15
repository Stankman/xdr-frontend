import { Avatar } from "../avatar/avatar.model";

export class Account {
    id!: number;
    email!: string;
    emailVerified?: boolean;
    emailVerifiedAt?: string | Date | null;
    createdAt?: string | Date;
    lastLogin?: string | Date | null;
    ip_current?: string;
    ip_register?: string;
    created_at?: string | Date;
    updated_at?: string | Date;
    roles?: unknown;
    permissions?: string[];
    activeAvatar?: Avatar | null;
}