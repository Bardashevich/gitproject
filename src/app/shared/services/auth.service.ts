import {Injectable} from '@angular/core';
import {AlertService} from "./alert.service";
import {LoginData} from "../models/login/login-data";
import {User} from "../models/login/user";
import {Observable} from "rxjs";
import {HttpClient} from "./http-client.service";
import {LocalStorageService} from "ng2-webstorage";
import {ContactsService} from "./contacts.service";
import {ImageService} from "./images.service";

@Injectable()
export class AuthService {

  private userKey = 'authenticatedUser';

  constructor(private http: HttpClient, private alertService: AlertService, private localStorage: LocalStorageService,
              private contactsService: ContactsService, private imagerService: ImageService) {
  }

  public login(loginModel: LoginData): Observable<User> {
    return this.http.post('rest/login', loginModel)
      .flatMap(response => {
        let user: User = response.json();
        return this.getAvatar().map(a => {
          user.avatar = a;
          this.setUser(user);
          return user;
        });
      })
      .catch(error => {
        this.resetAuthentication();
        this.alertService.error(error);
        return this.handleError(error);
      });
  }

  public logout(): Observable<any> {
    return this.http.post('rest/logout', {})
      .map(response => {
        this.resetAuthentication();
      })
      .catch(this.handleError);
  }

  public restore(): Observable<User> {
    return this.http.get('rest/login/roles')
      .map(response => {
        this.setUser(response.json());
        return response.json();
      })
      .catch(this.handleError);
  }

  private setUser(userData: User) {
    this.localStorage.store(this.userKey, userData);
  }

  private getAvatar(): Observable<any> {
    return this.imagerService.getUserPhoto();
  }

  public resetAuthentication() {
    this.localStorage.clear(this.userKey);
  }

  public isAuthenticated(): boolean {
    return !!this.localStorage.retrieve(this.userKey);
  }

  public getUser(): User {
    return this.localStorage.retrieve(this.userKey);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}