export class Api {
    status: string;
    code: number;
    exception: string;
    errors: [{ message: string; trace: string }];
    data: any;
}