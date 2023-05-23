export class Account {
    id: number;
    email: string;
    ip_current?: string;
    ip_register?: string;
    created_at: Date;
    updated_at?: Date;
    roles? : any;
}