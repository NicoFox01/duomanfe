import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ApplicationOut, ApplicationPayload, PresignResponse } from '../../models/application';

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_SIZE = 5 * 1024 * 1024;

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly api = `${environment.apiUrl}/applications`;

  constructor(private readonly http: HttpClient) {}

  presignResume(filename: string, size: number): Promise<PresignResponse> {
    return firstValueFrom(this.http.post<PresignResponse>(`${this.api}/presign-resume`, { filename, size }));
  }

  async uploadFile(uploadUrl: string, file: File): Promise<void> {
    await firstValueFrom(this.http.put(uploadUrl, file, { responseType: 'text' }));
  }

  create(payload: ApplicationPayload): Promise<ApplicationOut> {
    return firstValueFrom(this.http.post<ApplicationOut>(this.api, payload));
  }
}

export function validateResume(file: File): string | null {
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return 'Formato no permitido. Solo .pdf, .doc o .docx.';
  }
  if (file.size > MAX_SIZE) {
    return 'El archivo supera el tamaño máximo de 5 MB.';
  }
  return null;
}