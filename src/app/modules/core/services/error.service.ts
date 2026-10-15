import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class ErrorService {
    constructor(private readonly messages: MessageService, private readonly translate: TranslateService) {}

    public handleError(code?: number): void {
        this.messages.add({
            severity: 'error',
            summary: this.translate.instant('ERROR.REQUEST'),
            detail: this.translate.instant(code === 401 ? 'ERROR.SESSION' : 'ERROR.RETRY')
        });
    }
}
