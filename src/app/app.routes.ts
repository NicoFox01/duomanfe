import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin-layout/admin-layout').then((m) => m.AdminLayout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'cotizaciones',
        loadComponent: () => import('./features/admin/quotations/quotations').then((m) => m.Quotations),
      },
      {
        path: 'postulaciones',
        loadComponent: () => import('./features/admin/applications/applications').then((m) => m.Applications),
      },
      {
        path: 'empleados',
        loadComponent: () => import('./features/admin/employees/employees').then((m) => m.Employees),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];