import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private theme : BehaviorSubject<boolean>;

    private themeName : string;

    constructor()
    {
        if(!localStorage.getItem("xdr-theme"))
        {
            this.themeName = environment.app.theme;
            localStorage.setItem('xdr-theme', this.themeName);
        }

        this.themeName = localStorage.getItem('xdr-theme');
        this.theme = new BehaviorSubject<boolean>(this.themeName === 'dark');
        this.updateBody();
    }

    public setTheme(isDark : boolean) : void {
        this.themeName = isDark ? 'dark' : 'light';
        localStorage.setItem('xdr-theme', `${this.themeName}`);
        this.theme.next(isDark);
        this.updateBody();
    }

    public getTheme() : boolean {
        return this.theme.value;
    }

    public getThemeName() : string {
        return this.themeName;
    }

    private updateBody() {
        const body = document.getElementById('xdr-body');

        if(this.getTheme()) {
            body.classList.add('dark');
            body.classList.remove('light');
        } else {
            body.classList.add('light');
            body.classList.remove('dark'); 
        }
    }
}