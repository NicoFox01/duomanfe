import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { switchMap } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { QuotationOut, QUOTATION_STATUSES } from '../../../models/quotation';

@Component({
  selector: 'app-quotations',
  imports: [DatePipe],
  templateUrl: './quotations.html',
  styleUrl: './quotations.scss',
})
export class Quotations {
  protected readonly statuses = QUOTATION_STATUSES;
  protected readonly quotations = signal<QuotationOut[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly statusFilter = signal('');
  protected readonly search = signal('');
  protected readonly detail = signal<QuotationOut | null>(null);

  private readonly admin = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.admin
      .listQuotations(this.statusFilter() || undefined, this.search().trim() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.quotations.set(rows);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudieron cargar las cotizaciones.');
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

  protected changeStatus(q: QuotationOut, status: string): void {
    this.admin
      .updateQuotationStatus(q.id, status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.quotations.update((rows) => rows.map((row) => (row.id === updated.id ? updated : row)));
        },
        error: () => {
          this.error.set('No se pudo actualizar el estado.');
        },
      });
  }

  protected deleteQuotation(q: QuotationOut): void {
    if (!confirm(`¿Eliminar la cotización de ${q.full_name}?`)) {
      return;
    }
    this.admin
      .deleteQuotation(q.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.admin.listQuotations(this.statusFilter() || undefined, this.search().trim() || undefined)),
      )
      .subscribe({
        next: (rows) => this.quotations.set(rows),
        error: () => {
          this.error.set('No se pudo eliminar la cotización.');
        },
      });
  }
}