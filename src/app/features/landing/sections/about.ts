import { Component } from '@angular/core';

interface Pillar {
  title: string;
  text: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  imports: [],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  protected readonly values: Pillar[] = [
    {
      title: 'Responsabilidad',
      text: 'Cumplimos horarios, presupuestos y compromisos. Lo que prometemos, lo hacemos.',
      icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
    },
    {
      title: 'Calidad',
      text: 'Trabajo prolijo, materiales adecuados y terminaciones que duran en el tiempo.',
      icon: 'M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z',
    },
    {
      title: 'Transparencia',
      text: 'Presupuesto claro antes de empezar y comunicación directa en cada etapa.',
      icon: 'M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    },
    {
      title: 'Compromiso',
      text: 'Cuidamos cada detalle y nos hacemos responsables del resultado final.',
      icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    },
  ];
}