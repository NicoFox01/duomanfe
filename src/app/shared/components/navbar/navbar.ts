import { AfterViewInit, Component, signal } from '@angular/core';

import { ThemeService } from '../../../core/services/theme.service';

interface NavLink {
  label: string;
  href: string;
  id: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', href: '#inicio', id: 'inicio' },
  { label: 'Nosotros', href: '#nosotros', id: 'nosotros' },
  { label: 'Servicios', href: '#servicios', id: 'servicios' },
  { label: 'Cotizaciones', href: '#cotizaciones', id: 'cotizaciones' },
  { label: 'Trabajá con nosotros', href: '#trabaja-con-nosotros', id: 'trabaja-con-nosotros' },
];

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit {
  protected readonly links = NAV_LINKS;
  protected readonly theme = signal(false);
  protected readonly active = signal('');
  protected readonly menuOpen = signal(false);

  constructor(private readonly themeService: ThemeService) {
    this.theme.set(themeService.dark());
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.active.set(entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const link of NAV_LINKS) {
      const el = document.getElementById(link.id);
      if (el) {
        observer.observe(el);
      }
    }
  }

  toggleTheme(): void {
    this.themeService.toggle();
    this.theme.set(this.themeService.dark());
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
