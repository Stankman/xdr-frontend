import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ClientService } from './services/client.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'xdr-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ClientComponent implements OnInit {
  constructor() { }

  ngOnInit() {}
}
