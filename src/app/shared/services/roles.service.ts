import {Injectable} from "@angular/core";
import {HttpClient} from "./http-client.service";
import {Observable} from "rxjs";

@Injectable()
export class RoleService {

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get('rest/roles')
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