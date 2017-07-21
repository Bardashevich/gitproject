import {Injectable} from "@angular/core";
import {HttpClient} from "./http-client.service";
import {Observable} from "rxjs";
import {DomSanitizer} from '@angular/platform-browser';
import {ResponseContentType} from "@angular/http";

@Injectable()
export class ImageService {

  constructor(private http: HttpClient, private sanitizer:DomSanitizer) {
  }

  getContactPhoto(contactId: number): Observable<string> {
    return this.http.get(`rest/images/contact/${contactId}`, {responseType: ResponseContentType.ArrayBuffer})
      .map(response => {
        if (response.text()) {
          let arrayBufferView = new Uint8Array(response.arrayBuffer());
          let blob = new Blob([arrayBufferView], {type: 'image/png'});
          let win:any = window;
          let urlCreator = win.URL || win.webkitURL;
          return urlCreator.createObjectURL(blob);
        }
        return '';
      }).catch(this.handleError);
  }

  getUserPhoto(): Observable<string> {
    return this.http.get(`rest/images/user`, {responseType: ResponseContentType.ArrayBuffer})
      .map(response => {
        if (response.text()) {
          let arrayBufferView = new Uint8Array(response.arrayBuffer());
          return 'data:image/png;base64,' + btoa(String.fromCharCode(...new Uint8Array(arrayBufferView)));
        }
        return '';
      }).catch(this.handleError);
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}