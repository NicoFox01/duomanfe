import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApplicationService, validateResume } from '../../../core/services/application.service';
import { RESIDENCY_ZONES, ResidencyZone, TARGET_ROLES } from '../../../models/application';

@Component({
  selector: 'app-careers-form',
  imports: [ReactiveFormsModule],
  templateUrl: './careers-form.html',
  styleUrl: './careers-form.scss',
})
export class CareersForm {
  protected readonly zones = RESIDENCY_ZONES;
  protected readonly roles = TARGET_ROLES;
  protected readonly file = signal<File | null>(null);
  protected readonly fileError = signal('');
  protected readonly submitted = signal(false);
  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    full_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    phone: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    zone: ['', Validators.required],
    target_role: ['', Validators.required],
    website: [''],
  });

  private readonly applicationService = inject(ApplicationService);

  protected onFilePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const picked = input.files?.[0] ?? null;
    this.setFile(picked);
    if (!picked) {
      input.value = '';
    }
  }

  protected onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const dropped = event.dataTransfer?.files[0] ?? null;
    this.setFile(dropped);
  }

  protected removeFile(): void {
    this.file.set(null);
    this.fileError.set('');
  }

  protected fileSizeLabel(size: number): string {
    if (size >= 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.round(size / 1024)} KB`;
  }

  protected async onSubmit(): Promise<void> {
    this.form.markAllAsTouched();
    const file = this.file();
    if (this.form.invalid) {
      return;
    }
    if (!file) {
      this.fileError.set('Adjuntá tu CV en formato PDF, DOC o DOCX (máx 5 MB).');
      return;
    }

    this.submitting.set(true);
    this.error.set('');
    try {
      const presign = await this.applicationService.presignResume(file.name, file.size);
      await this.applicationService.uploadFile(presign.upload_url, file);
      await this.applicationService
        .create({
          full_name: this.form.value.full_name ?? '',
          phone: this.form.value.phone ?? '',
          email: this.form.value.email ?? '',
          zone: this.form.value.zone as ResidencyZone,
          target_role: this.form.value.target_role ?? '',
          resume_path: presign.path,
          website: this.form.value.website?.trim() || null,
        });
      this.submitted.set(true);
      this.scrollIntoView();
    } catch {
      this.error.set('No pudimos enviar tu postulación. Intentá nuevamente en unos minutos.');
    } finally {
      this.submitting.set(false);
    }
  }

  protected resetForm(): void {
    this.form.reset();
    this.file.set(null);
    this.fileError.set('');
    this.submitted.set(false);
  }

  private setFile(file: File | null): void {
    this.fileError.set('');
    if (!file) {
      this.file.set(null);
      return;
    }
    const validationError = validateResume(file);
    if (validationError) {
      this.fileError.set(validationError);
      this.file.set(null);
      return;
    }
    this.file.set(file);
  }

  private scrollIntoView(): void {
    const el = document.getElementById('trabaja-con-nosotros');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  }
}