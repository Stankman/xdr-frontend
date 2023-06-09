import { Component, Input } from '@angular/core';

@Component({
  selector: 'xdr-info-block',
  templateUrl: './info-block.component.html',
  styleUrls: ['./info-block.component.scss']
})
export class InfoBlockComponent {
  private _title : string = 'UNDEFINED';
  private _body : string = 'UNDEFINED';
  
  @Input('title')
  public set title(value: string) {
    this._title = value;
  }

  @Input('body')
  public set body(value: string) {
    this._body = value;
  }

  public get title() : string {
    return this._title;
  }

  public get body() : string {
    return this._body
  }
}
