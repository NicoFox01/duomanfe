import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  protected readonly nav = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: 'chart' },
    { path: '/admin/cotizaciones', label: 'Cotizaciones', icon: 'clipboard' },
    { path: '/admin/postulaciones', label: 'Postulaciones', icon: 'users' },
    { path: '/admin/empleados', label: 'Empleados', icon: 'briefcase' },
  ];

  protected readonly theme = inject(ThemeService);
  protected readonly menuOpen = signal(false);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }
}