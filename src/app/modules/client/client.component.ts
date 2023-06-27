import { Component, OnInit } from '@angular/core';
import { ClientService } from './services/client.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'xdr-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  constructor() { }

  ngOnInit() {}
}
