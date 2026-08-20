import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { QuotationService } from '../../../core/services/quotation.service';
import { SERVICE_CATEGORIES, SERVICES } from '../../../shared/data/services';
import { Service } from '../../../models/service';

type ServiceControl = FormControl<boolean | null>;

@Component({
  selector: 'app-quote-form',
  imports: [ReactiveFormsModule],
  templateUrl: './quote-form.html',
  styleUrl: './quote-form.scss',
})
export class QuoteForm {
  protected readonly categories = SERVICE_CATEGORIES;
  protected readonly services = SERVICES;
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.maxLength(50)]],
    company: [''],
    location: ['', [Validators.required, Validators.maxLength(200)]],
    notes: ['', [Validators.maxLength(5000)]],
    website: [''],
    services: this.fb.array<ServiceControl>(SERVICES.map(() => this.fb.control<boolean | null>(false))),
  });

  private readonly quotationService = inject(QuotationService);
  private readonly destroyRef = inject(DestroyRef);

  get serviceControls(): FormArray<ServiceControl> {
    return this.form.get('services') as FormArray<ServiceControl>;
  }

  protected servicesByCategory(categoryId: string): Service[] {
    return this.services.filter((service) => service.categoryId === categoryId);
  }

  protected selectedServices(): Service[] {
    return this.services.filter((service, index) => Boolean(this.serviceControls.at(index).value));
  }

  protected hasSelection(): boolean {
    return this.serviceControls.value.some((value) => Boolean(value));
  }

  protected onServiceSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const id = select.value;
    select.value = '';
    const index = this.services.findIndex((service) => service.id === id);
    if (index >= 0) {
      this.serviceControls.at(index).setValue(true);
    }
  }

  protected removeService(service: Service): void {
    const index = this.services.findIndex((item) => item.id === service.id);
    if (index >= 0) {
      this.serviceControls.at(index).setValue(false);
    }
  }

  protected onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const selectedServices = this.services
      .map((service, index) => (this.serviceControls.at(index).value ? service.name : null))
      .filter((name): name is string => Boolean(name));

    const payload = {
      full_name: this.form.value.full_name ?? '',
      email: this.form.value.email ?? '',
      phone: this.form.value.phone ?? '',
      company: this.form.value.company?.trim() || null,
      location: this.form.value.location ?? '',
      services: selectedServices,
      notes: this.form.value.notes?.trim() || null,
      website: this.form.value.website?.trim() || null,
    };

    this.submitting.set(true);
    this.error.set('');
    this.quotationService
      .create(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
          this.scrollIntoView();
        },
        error: () => {
          this.submitting.set(false);
          this.error.set('No pudimos enviar tu solicitud. Intentá nuevamente en unos minutos.');
        },
      });
  }

  protected resetForm(): void {
    this.form.reset({ services: this.services.map(() => false) });
    this.submitted.set(false);
  }

  private scrollIntoView(): void {
    const el = document.getElementById('cotizaciones');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  }
}