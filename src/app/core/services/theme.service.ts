import { Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';

const STORAGE_KEY = 'duoman-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly dark = signal(false);

  private readonly renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.dark.set(this.loadInitial());
    this.apply(this.dark());
  }

  toggle(): void {
    this.dark.update((value) => !value);
    this.apply(this.dark());
  }

  private apply(dark: boolean): void {
    this.renderer.setAttribute(document.documentElement, 'class', dark ? 'dark' : '');
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }

  private loadInitial(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'dark';
  }
}