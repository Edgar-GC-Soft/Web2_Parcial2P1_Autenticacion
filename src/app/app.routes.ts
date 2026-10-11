import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { SinAcceso } from './components/sin-acceso/sin-acceso';
import { authGuard } from './guard/auth-guard';
import { roleGuard } from './guard/role-guard';

export const routes: Routes = [
  // ruta inicial
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // ruta publica
  { path: 'login', component: Login },
  // ruta protegida: primero revisa la sesion y luego el rol
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin', 'cliente'] }
  },
  // ruta de acceso denegado
  { path: 'sin-acceso', component: SinAcceso },
  // cualquier otra ruta
  { path: '**', redirectTo: '/login' }
];