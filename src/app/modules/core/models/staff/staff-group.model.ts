export interface StaffMember {
    username: string;
    look: string;
    motto: string;
    online: boolean;
}

export interface StaffGroup {
    name: string;
    displayName: string;
    weight: number;
    members: StaffMember[];
}
