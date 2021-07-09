import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse, HttpClient
} from '@angular/common/http';

import {Observable, of, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {CookieService} from 'ngx-cookie-service';
import { Router } from '@angular/router';
import {ApiserviceService} from './apiservice.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  constructor(private apiserviceService: ApiserviceService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this section call before every request.
    let token = '';
    let userID = '';
    if (localStorage.getItem('token') != null) {
      token = localStorage.getItem('token');
    }
    if (localStorage.getItem('userID') != null) {
      userID = localStorage.getItem('userID');
    }
    if (token !== undefined && token !== '') {
      request = request.clone({ headers: request.headers.set('Authorization', token) });
    }
    request = request.clone({ headers: request.headers.set('userID', userID) });

    /*return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          alert('event--->>>' + event.status);
          if (event.status === 401) {
            this.router.navigate(['/main']);
          }
        }
        return event;
      }));*/
    return next.handle(request).pipe(catchError(x => this.handleAuthError(x)));
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401 || err.status === 403) {
      this.apiserviceService.removeItemFromLocalStorage();
      this.apiserviceService.router.navigateByUrl('/main');
      return of(err.message);
    }
    return throwError(err);
  }
}
