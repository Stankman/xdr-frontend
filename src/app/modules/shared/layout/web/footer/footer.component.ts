import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'xdr-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public themeName : string = 'light';

  constructor(
    public themeService : ThemeService
  ) { }

  ngOnInit() {
    this.themeService.getThemeSubject().subscribe((value : boolean) => {
      this.themeName = this.themeService.getThemeName();
    })
  }

}
