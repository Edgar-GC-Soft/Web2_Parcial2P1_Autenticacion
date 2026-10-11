import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    // el login usa localStorage (solo existe en el navegador), por eso no se prerenderiza
    renderMode: RenderMode.Client
  }
];