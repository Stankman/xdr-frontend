import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private previousURLSubject: BehaviorSubject<string>;

  constructor() {
    this.previousURLSubject = new BehaviorSubject<string>('/');
  }

  public get previousURL(): string {
    return this.previousURLSubject.getValue();
  }

  public set previousURL(value: string) {
      this.previousURLSubject.next(value);
  }
}
