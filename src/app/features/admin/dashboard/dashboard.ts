import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AdminService } from '../../../core/services/admin.service';
import { Metrics } from '../../../models/metrics';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly metrics = signal<Metrics | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  private readonly admin = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
  }

  protected refresh(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set('');
    this.admin
      .metrics()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (m) => {
          this.metrics.set(m);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudieron cargar las métricas.');
        },
      });
  }
}