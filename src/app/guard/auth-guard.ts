import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

// guardian de autenticacion: solo deja pasar si hay una sesion valida
export const authGuard: CanActivateFn = () => {
  // obtenemos el servicio de autenticacion
  const authService = inject(AuthService);
  // obtenemos el servicio de navegacion
  const router = inject(Router);

  // verificamos si el usuario tiene una sesion
  if (authService.estaAutenticado()) {
    return true; // permitimos el acceso
  }

  // si no esta autenticado, redirigimos al login
  return router.createUrlTree(['/login']);
};