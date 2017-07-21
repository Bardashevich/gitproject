import {Injectable} from "@angular/core";
import {HttpClient} from "./http-client.service";
import {Observable} from "rxjs";
import {UserFilter} from "../models/users/user-filter";
import {DataPage} from "../models/grid/data-page";
import {SecuredUser} from "../models/users/secured-user";
import {URLSearchParams} from "@angular/http";
import {AclEntry} from "../models/users/acl-entry";
import {PublicUser} from "../models/users/public-user";

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {
  }

  find(userFilter: UserFilter): Observable<DataPage<SecuredUser>> {
    let params: URLSearchParams = new URLSearchParams();
    Object.keys(userFilter).map(key => {
      params.set(key, userFilter[key]);
    });
    return this.http.get('rest/users/find', {search: params})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getPublicUsers(): Observable<Array<PublicUser>> {
    return this.http.get('rest/users/public')
      .map(response => response.json())
      .catch(this.handleError);
  }

  findPublicUsers(userFilter: UserFilter): Observable<DataPage<SecuredUser>> {
    let params: URLSearchParams = new URLSearchParams();
    Object.keys(userFilter).map(key => {
      params.set(key, userFilter[key]);
    });
    return this.http.get('rest/users/public/find', {search: params})
      .map(response => response.json())
      .catch(this.handleError);
  }

  getById(userId: number): Observable<SecuredUser> {
    return this.http.get(`rest/users/${userId}`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  activate(userId: number): Observable<any> {
    return this.http.put(`rest/users/activate/${userId}`, {})
      .catch(this.handleError);
  }

  deactivate(userId: number): Observable<any> {
    return this.http.put(`rest/users/deactivate/${userId}`, {})
      .catch(this.handleError);
  }

  update(user: SecuredUser): Observable<any> {
    return this.http.put('rest/users', user)
      .catch(this.handleError);
  }

  getAcls(userId: number): Observable<Array<AclEntry>> {
    return this.http.get(`rest/users/${userId}/acls`)
      .map(response => response.json())
      .catch(this.handleError);
  }

  deleteAcl(userId: number, principalId: number): Observable<any> {
    return this.http.delete(`rest/users/${userId}/acls/${principalId}`)
      .catch(this.handleError);
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}