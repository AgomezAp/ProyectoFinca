import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const correoGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const correoIngresado = localStorage.getItem('correo');

  const listaBlanca = ['admin@example.com']

  if (correoIngresado && listaBlanca.includes(correoIngresado)) {
    return true
  }

  return router.createUrlTree(['/']);
};
