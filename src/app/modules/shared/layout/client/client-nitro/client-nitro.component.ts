import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ClientService } from 'src/app/modules/client/services/client.service';
import { client } from 'src/environments/environment';

@Component({
  selector: 'xdr-client-nitro',
  templateUrl: './client-nitro.component.html',
  styleUrls: ['./client-nitro.component.scss']
})
export class ClientNitroComponent implements OnInit, OnDestroy {
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
                this.initNitro(sso);    
              }
            });
          }
        }
      }
    });
  }

  private initNitro(sso : string): void {
    this.initIFrame(sso);

    this.nitroLoaded = true;
    this.nitroLoading = false;
  }

  private initIFrame(sso : string): void {
    if(!this.iframe) {
      this.iframe = document.createElement('iframe');
      this.iframe.src = `${ client.nitro.source }?sso=${sso}`;
      this.iframe.height = '100%';
      this.iframe.width = '100%';
      this.elementRef.nativeElement.appendChild(this.iframe);
    }
  }

  ngOnDestroy(): void {
    console.log("This is closed");
  }
}