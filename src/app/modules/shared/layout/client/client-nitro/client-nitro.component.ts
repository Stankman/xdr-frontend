import { Component, ElementRef, OnInit } from '@angular/core';
import { ClientService } from 'src/app/modules/client/services/client.service';
import { client } from 'src/environments/environment';

@Component({
  selector: 'xdr-client-nitro',
  templateUrl: './client-nitro.component.html',
  styleUrls: ['./client-nitro.component.scss']
})
export class ClientNitroComponent implements OnInit {
  private nitroLoading : boolean;
  private nitroLoaded : boolean;
  private iframe : HTMLIFrameElement;
  
  constructor(
    private readonly clientService : ClientService,
    private readonly elementRef : ElementRef
  ) {
    this.nitroLoading = false;
    this.nitroLoaded = false;
  }

  ngOnInit(): void {
    this.clientService.clientOpenedObservable.subscribe({
      next: (opened : boolean) => {
        if(opened) {
          if(this.clientService.sso && !this.nitroLoaded ) {

          } else {
            this.nitroLoading = true;
      
            this.clientService.ticket().subscribe({
              next: (sso : string) => {
                this.initNitro();    
              }
            });
          }
        }
      }
    });
  }

  private initNitro(): void {
    this.initIFrame();

    this.nitroLoaded = true;
    this.nitroLoading = false;
  }

  private initIFrame(): void {
    if(!this.iframe) {
      this.iframe = document.createElement('iframe');
      this.iframe.src = `${ client.nitro.source }?sso=${this.clientService.sso}`;
      this.iframe.height = '100%';
      this.iframe.width = '100%';
      this.elementRef.nativeElement.appendChild(this.iframe);
    }
  }
}