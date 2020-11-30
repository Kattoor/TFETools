import {Injectable} from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import {Observable} from 'rxjs';

@Injectable()
export class TfeHttpInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.startsWith('/')) {
            const devReq = req.clone({url: `http://localhost:4201${req.url}`});
            return next.handle(devReq);
        } else {
            return next.handle(req);
        }
    }
}
