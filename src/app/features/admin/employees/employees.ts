import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { EmployeeOut } from '../../../models/employee';

@Component({
  selector: 'app-employees',
  imports: [ReactiveFormsModule],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees {
  protected readonly employees = signal<EmployeeOut[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly search = signal('');
  protected readonly creating = signal(false);
  protected readonly showForm = signal(false);

  private readonly admin = inject(AdminService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    email: ['', [Validators.email]],
    phone: ['', [Validators.required, Validators.maxLength(50)]],
    role: ['', [Validators.required, Validators.maxLength(100)]],
    specialties: [''],
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.admin
      .listEmployees(this.search().trim() || undefined)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.employees.set(rows);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set('No se pudieron cargar los empleados.');
        },
      });
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    this.load();
  }

  protected toggleForm(): void {
    this.showForm.update((value) => !value);
  }

  protected onCreateSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const specialties = (this.form.value.specialties ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    this.creating.set(true);
    this.error.set('');
    this.admin
      .createEmployee({
        full_name: this.form.value.full_name ?? '',
        email: this.form.value.email?.trim() || null,
        phone: this.form.value.phone ?? '',
        role: this.form.value.role ?? '',
        specialties,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.admin.listEmployees(this.search().trim() || undefined)),
      )
      .subscribe({
        next: (rows) => {
          this.employees.set(rows);
          this.creating.set(false);
          this.showForm.set(false);
          this.form.reset({ specialties: '' });
        },
        error: () => {
          this.creating.set(false);
          this.error.set('No se pudo crear el empleado.');
        },
      });
  }

  protected deleteEmployee(e: EmployeeOut): void {
    if (!confirm(`¿Eliminar a ${e.full_name}?`)) {
      return;
    }
    this.admin
      .deleteEmployee(e.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.admin.listEmployees(this.search().trim() || undefined)),
      )
      .subscribe({
        next: (rows) => this.employees.set(rows),
        error: () => {
          this.error.set('No se pudo eliminar el empleado.');
        },
      });
  }
}