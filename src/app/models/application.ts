export type ResidencyZone = 'CABA' | 'GBA Norte' | 'GBA Sur' | 'GBA Oeste';

export const RESIDENCY_ZONES: ResidencyZone[] = ['CABA', 'GBA Norte', 'GBA Sur', 'GBA Oeste'];

export const TARGET_ROLES: string[] = [
  'Técnico Multi-tarea General',
  'Electricista',
  'Plomero',
  'Técnico en Climatización',
  'Albañil / Constructor',
  'Pintor',
  'Herrero',
  'Cerrajero',
  'Administrativo / Atención al cliente',
];

export interface PresignResponse {
  upload_url: string;
  path: string;
}

export interface ApplicationPayload {
  full_name: string;
  phone: string;
  email: string;
  zone: ResidencyZone;
  target_role: string;
  resume_path: string;
  website?: string | null;
}

export const CANDIDATE_STATUSES: string[] = [
  'Postulado',
  'Visto',
  'Contactado',
  'Entrevistado',
  'No aplica',
  'Contratado',
];

export interface ApplicationOut {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  zone: string;
  target_role: string;
  resume_url: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminApplicationOut extends ApplicationOut {
  signed_resume_url?: string | null;
}