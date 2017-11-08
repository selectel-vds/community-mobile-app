import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable, Injector} from "@angular/core";
import {AuthService} from "./auth-service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class VscaleAuthenticationInterceptor implements HttpInterceptor {

  private authService : AuthService;

  constructor(public inj: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.authService) {
      this.authService = this.inj.get(AuthService)
    }
    if(this.authService.getToken()) {
      req = req.clone({
        headers: req.headers.set('X-Token', this.authService.getToken())
      });
    }
    //return next.handle(req);

    return next
      .handle(req);
      // .catch(response => {
      //   if (response instanceof HttpErrorResponse) {
      //     console.log('HttpErrorResponse', response);
      //     let errorMessage = response.headers.get("Vscale-Error-Message");
      //     if(!errorMessage) {
      //       if(response.status > 399 && response.status < 400) {
      //         errorMessage = "Bad request";
      //       } else if(response.status > 499 && response.status < 600) {
      //         errorMessage = "Server error";
      //       } else {
      //         errorMessage = "Unknown error";
      //       }
      //     }
      //     if (response.status === 401 || response.status === 403) {
      //       errorMessage = "Unauthorized";
      //     }
      //     return Observable.throw(errorMessage);
      //   }
      //   return Observable.throw(response);
      // });
  }
}
