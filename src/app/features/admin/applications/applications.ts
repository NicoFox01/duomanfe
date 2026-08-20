import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { AdminApplicationOut, CANDIDATE_STATUSES } from '../../../models/application';

@Component({
  selector: 'app-applications',
  imports: [DatePipe],
  templateUrl: './applications.html',
  styleUrl: './applications.scss',
})
export class Applications {
  protected readonly statuses = CANDIDATE_STATUSES;
  protected readonly applications = signal<AdminApplicationOut[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly statusFilter = signal('');
  protected readonly search = signal('');
  protected readonly detail = signal<AdminApplicationOut | null>(null);

  private readonly admin = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.admin
      .listApplications(this.statusFilter() || undefined, this.search().trim() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.applications.set(rows);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudieron cargar las postulaciones.');
        },
      });
  }

  protected setStatusFilter(value: string): void {
    this.statusFilter.set(value);
    this.load();
  }

  protected selectedValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    this.load();
  }

  protected changeStatus(a: AdminApplicationOut, status: string): void {
    this.admin
      .updateApplicationStatus(a.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.applications.update((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
        },
        error: () => {
          this.error.set('No se pudo actualizar el estado.');
        },
      });
  }

  protected deleteApplication(a: AdminApplicationOut): void {
    if (!confirm(`¿Eliminar la postulación de ${a.full_name}?`)) {
      return;
    }
    this.admin
      .deleteApplication(a.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.admin.listApplications(this.statusFilter() || undefined, this.search().trim() || undefined)),
      )
      .subscribe({
        next: (rows) => this.applications.set(rows),
        error: () => {
          this.error.set('No se pudo eliminar la postulación.');
        },
      });
  }
}