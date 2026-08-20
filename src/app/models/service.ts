export interface ServiceCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  summary: string;
  details: string[];
  image: string;
}