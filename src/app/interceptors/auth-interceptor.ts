import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ServAuth } from '../services/serv-auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(ServAuth);
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
