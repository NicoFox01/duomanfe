export const QUOTATION_STATUSES: string[] = [
  'Pendiente',
  'Contactado',
  'Cotización Presentada',
  'Propuesta Confirmada',
  'Rechazada',
  'Cancelada',
];

export interface QuotationPayload {
  full_name: string;
  email: string;
  phone: string;
  company?: string | null;
  location: string;
  services: string[];
  notes?: string | null;
  website?: string | null;
}

export interface QuotationOut {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company: string | null;
  location: string;
  services: string[];
  notes: string | null;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}