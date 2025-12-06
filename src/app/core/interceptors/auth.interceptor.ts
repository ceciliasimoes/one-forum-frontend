import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';

import { TokenService } from '../services/token.service';
import { BehaviorSubject, throwError, catchError, switchMap, filter, take, Observable } from 'rxjs';
import { RefreshService } from '../services/refresh.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptorFn: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const tokenService = inject(TokenService);
  const refreshService = inject(RefreshService);

  const access = tokenService.getAccessToken();
  let newReq = req;

  if (access) {
    newReq = req.clone({
      setHeaders: { Authorization: `Bearer ${access}` },
    });
  }

  return next(newReq).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse) {
        const isAuthError = err.status === 401 || 
          (err.status === 400 && err.error?.type === 'TOKEN_VALIDATION');
        
        if (isAuthError) {
          return handle401(newReq, next, tokenService, refreshService);
        }
      }
      return throwError(() => err);
    })
  );
};

function handle401(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  refreshService: RefreshService
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      isRefreshing = false;
      tokenService.clear();
      return throwError(() => new Error('NO_REFRESH_TOKEN'));
    }

    return refreshService.refresh(refreshToken).pipe(
      switchMap((res) => {
        isRefreshing = false;
        tokenService.saveTokens(res.accessToken, res.refreshToken);
        refreshTokenSubject.next(res.accessToken);

        return next(
          request.clone({
            setHeaders: { Authorization: `Bearer ${res.accessToken}` },
          })
        );
      }),
      catchError((error) => {
        isRefreshing = false;
        refreshTokenSubject.next(null);
        tokenService.clear();
        return throwError(() => error);
      })
    );
  }

  return refreshTokenSubject.pipe(
    filter((token) => token !== null),
    take(1),
    switchMap((token) =>
      next(
        request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
        })
      )
    )
  );
}
