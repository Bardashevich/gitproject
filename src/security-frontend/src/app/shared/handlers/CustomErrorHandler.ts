import {ErrorHandler, Injectable, Injector} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Injectable()
export class CustomErrorHandler extends ErrorHandler {

  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any) {
    if (!!error && (error.toString().startsWith('403') || error.toString().startsWith('401'))) {
      let authService = this.injector.get(AuthService);
      authService.resetAuthentication();
      window.location.href = '#/login';
    } else {
      super.handleError(error);
    }
  }
}