export class Api<T = unknown> {
    status!: string;
    code!: number;
    exception?: string;
    errors?: unknown;
    data!: T;
}