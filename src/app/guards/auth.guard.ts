import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ServAuth } from '../services/serv-auth';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(ServAuth);
  const router = inject(Router);

  if (state.url.includes('/login')) {
    return true;
  }

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const rolesPermitidos = route.data?.['roles'] as string[] | undefined;
  const rolUsuario = authService.getUserRole(); 

  if (rolesPermitidos && (!rolUsuario || !rolesPermitidos.includes(rolUsuario))) {
    alert('Acceso denegado: Tu usuario no cuenta con los permisos administrativos para esta acción.');
    router.navigate(['/incidentes']); 
    return false;
  }

  return true; 
};