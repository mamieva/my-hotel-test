import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import * as _ from 'lodash';
import {Observable} from 'rxjs';
import {Params} from '@angular/router';
import {serialize} from 'object-to-formdata';

declare var $: any;

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(public http: HttpClient) {
    }

    refactorUrl(url: string[] | string): string {
        if (_.isArray(url)) {
            url = url as string[];
            url = url.join('/');
        }

        url = url as string;

        if (url.indexOf('http://') === -1
            && url.indexOf('https://') === -1) {
            if (url.charAt(0) === '/') {
                url = url.replace('/', '');
            }
            url = [environment.apiUrl, url].join('/');
        } else {
            url = url as string;
        }

        return url;
    }

    /**
     * Por medio de los parámetros page y pageSize de la queryString devuelve el fragmento de la url para paginar un listado.
     * @param params: Params
     * @return string
     */

    createHttpParams(queryParams: Params): HttpParams {
        let httpParams = new HttpParams();

        return httpParams;
    }

    jsonp<T>(url: any[] | string, callback: string): Observable<any> {
        url = this.refactorUrl(url);

        return this.http.jsonp(url,  callback);
    }

    get<T>(url: any[] | string, queryString?: Params, options?: any): Observable<any> {
        const params = queryString ? this.createHttpParams(queryString) : {};

        options = _.merge({}, {params}, options);
        url = this.refactorUrl(url);

        return this.http.get(url, options);
    }

    post<T>(url: any[] | string, data?: any, httpOptions?: any): Observable<any> {
        const formData = serialize(data);

        url = this.refactorUrl(url);
        httpOptions = httpOptions || {};

        return this.http.post(url, formData, httpOptions);
    }

    patch<T>(url: any[] | string, data: any): Observable<any> {
        url = this.refactorUrl(url);

        return this.http.patch(url, data);
    }

    put<T>(url: any[] | string, data: any): Observable<any> {
        url = this.refactorUrl(url);

        return this.http.put(url, data);
    }

    remove<T>(url: any[] | string, queryString?: Params, options?: any): Observable<any> {
        const params = queryString ? this.createHttpParams(queryString) : {};

        options = _.merge({}, {params}, options);
        url = this.refactorUrl(url);

        return this.http.delete(url, options);
    }
}
