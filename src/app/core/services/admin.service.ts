import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AdminApplicationOut } from '../../models/application';
import { EmployeeOut, EmployeePayload } from '../../models/employee';
import { Metrics } from '../../models/metrics';
import { QuotationOut } from '../../models/quotation';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/admin`;

  metrics(): Observable<Metrics> {
    return this.http.get<Metrics>(`${this.api}/metrics`);
  }

  listQuotations(status?: string, search?: string): Observable<QuotationOut[]> {
    return this.http.get<QuotationOut[]>(`${this.api}/quotations`, {
      params: this.withParams({ status, search }),
    });
  }

  updateQuotationStatus(id: string, status: string): Observable<QuotationOut> {
    return this.http.patch<QuotationOut>(`${this.api}/quotations/${id}/status`, { status });
  }

  deleteQuotation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/quotations/${id}`);
  }

  listApplications(status?: string, search?: string): Observable<AdminApplicationOut[]> {
    return this.http.get<AdminApplicationOut[]>(`${this.api}/applications`, {
      params: this.withParams({ status, search }),
    });
  }

  updateApplicationStatus(id: string, status: string): Observable<AdminApplicationOut> {
    return this.http.patch<AdminApplicationOut>(`${this.api}/applications/${id}/status`, { status });
  }

  deleteApplication(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/applications/${id}`);
  }

  listEmployees(search?: string): Observable<EmployeeOut[]> {
    return this.http.get<EmployeeOut[]>(`${this.api}/employees`, {
      params: this.withParams({ search }),
    });
  }

  createEmployee(payload: EmployeePayload): Observable<EmployeeOut> {
    return this.http.post<EmployeeOut>(`${this.api}/employees`, payload);
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/employees/${id}`);
  }

  private withParams(values: { status?: string; search?: string }): HttpParams {
    let params = new HttpParams();
    if (values.status) {
      params = params.set('status_filter', values.status);
    }
    if (values.search) {
      params = params.set('search', values.search);
    }
    return params;
  }
}