import { Component, effect, signal } from '@angular/core';

import { Service } from '../../../models/service';
import { SERVICE_CATEGORIES, SERVICES } from '../../../shared/data/services';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
})
export class Services {
  protected readonly categories = SERVICE_CATEGORIES;
  protected readonly services = SERVICES;
  protected readonly selected = signal<Service | null>(null);

  constructor() {
    effect(() => {
      document.body.style.overflow = this.selected() ? 'hidden' : '';
    });
  }

  protected servicesByCategory(categoryId: string): Service[] {
    return this.services.filter((service) => service.categoryId === categoryId);
  }

  protected select(service: Service | null): void {
    this.selected.set(service);
  }
}