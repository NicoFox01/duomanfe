export interface EmployeePayload {
  full_name: string;
  email?: string | null;
  phone: string;
  role: string;
  specialties: string[];
}

export interface EmployeeOut {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  role: string;
  specialties: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}