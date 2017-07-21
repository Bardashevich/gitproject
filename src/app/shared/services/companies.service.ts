import {Injectable} from "@angular/core";
import {HttpClient} from "./http-client.service";
import {Observable} from "rxjs";
import {URLSearchParams} from "@angular/http";

@Injectable()
export class CompaniesService {
    
    constructor(private http: HttpClient){}
    
    public find(filter: Object): Observable<any>{
        let params: URLSearchParams = new URLSearchParams();
        Object.keys(filter).map(key => {
            params.set(key, filter[key]);
        });
        return this.http.get('rest/companies', {search: params})
            .map(response => response.json())
            .catch(this.handleError);
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
