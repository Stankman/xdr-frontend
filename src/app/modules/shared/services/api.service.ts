import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiPagination } from "../../core/models/api/api-pagination.model";
import { Api } from "../../core/models/api/api.model";
import { HttpLoaderService } from "./http-loader.service";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(
        private http : HttpClient, 
        private httpLoaderService : HttpLoaderService
    ) { }

    /**
     * Sends a POST request
     *
     * @param url
     * @param body
     * @param options
     * @param loader
     * @return Observable<API>
    */
    public post(url : string, body : any = {}, options = {}, loader : boolean = true): Observable<Api> {
        this.isLoadable(url, loader);
        return this.http.post<Api>(this.url(url), body, options);
    }

    /**
     * Sends a GET request
     * @param url
     * @param options
     * @param loader
     * @return Observable<API>
    */
    public get(url: string, options: {} = {}, loader: boolean = true): Observable<Api | ApiPagination> {
        this.isLoadable(url, loader);
        return this.http.get<Api>(this.url(url),options);
    }

    /**
     * Sends a PUT request
     * @param url
     * @param body
     * @param options
     * @param loader
     * @return Observable<API>
    */
    public put(url: string, body: any = {}, options: {} = {}, loader: boolean = true): Observable<Api> {
        this.isLoadable(url, loader);
        return this.http.put<Api>(this.url(url),body,options);
    }

    /**
     * Sends a DELETE request
     * @param url
     * @param options
     * @param loader
     * @return Observable<API>
    */
    public delete(url: string, options: {} = {}, loader: boolean = true): Observable<Api> {
        this.isLoadable(url, loader);
        return this.http.delete<Api>(this.url(url),options);
    }

    /**
     * Appends the parameter to the pre-configured API URL
     * @param value
     * @return string
    */
    private url(value: string): string {
        return `${environment.app.endpoint}/${value}`;
    }

    /**
     * Checks if the route is loadable
     * @param path
     * @param loader
    */
    private isLoadable(path: string, loader: boolean): void {
        const url = this.url(path);

        if (!loader && !this.httpLoaderService.has(url)) {
        this.httpLoaderService.push(url);
        }
    }
}