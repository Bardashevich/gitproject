import {Injectable} from "@angular/core";
import {Headers, Http} from "@angular/http";

@Injectable()
export class HttpClient {

  constructor(private http: Http) {

  }

  createContentTypeHeader(options) {
    options.headers.append('Accept', 'application/json');
    options.withCredentials = true;
  }

  initializeOptions(options) {
    if (!options) {
      options = {};
    }
    if (!options.headers) {
      options.headers = new Headers();
    }
    return options;
  }

  get(url, options?) {
    options = this.initializeOptions(options);
    this.createContentTypeHeader(options);
    return this.http.get(url, options);
  }

  put(url, data, options?) {
    options = this.initializeOptions(options);
    this.createContentTypeHeader(options);
    return this.http.put(url, data, options);
  }

  delete(url, options?) {
    options = this.initializeOptions(options);
    this.createContentTypeHeader(options);
    return this.http.delete(url, options);
  }

  post(url, data, options?) {
    options = this.initializeOptions(options);
    this.createContentTypeHeader(options);
    return this.http.post(url, data, options);
  }
}
