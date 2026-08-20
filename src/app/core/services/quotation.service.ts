import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { QuotationOut, QuotationPayload } from '../../models/quotation';

@Injectable({ providedIn: 'root' })
export class QuotationService {
  private readonly api = `${environment.apiUrl}/quotations`;

  constructor(private readonly http: HttpClient) {}

  create(payload: QuotationPayload): Observable<QuotationOut> {
    return this.http.post<QuotationOut>(this.api, payload);
  }
}