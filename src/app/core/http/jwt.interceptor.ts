import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CredentialsService } from '../authentication/credentials.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private credentialsService: CredentialsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    let credentials = this.credentialsService.credentials;
    if (credentials && credentials.access_token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${credentials.access_token}`
        }
      });
    }

    return next.handle(request);
  }
}
