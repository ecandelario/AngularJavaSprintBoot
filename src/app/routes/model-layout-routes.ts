import { Routes } from '@angular/router';

export const MODEL_LAYOUT_ROUTE: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('../modules/dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
  },
  {
    path: 'autor',
    loadChildren: () =>
      import('../modules/autor/autor.module').then(m => m.AutorModule),
  },
  {
    path: 'editorial',
    loadChildren: () =>
      import('../modules/editorial/editorial.module').then(m => m.EditorialModule),
  },
  {
    path: 'libro',
    loadChildren: () =>
      import('../modules/libro/libro.module').then(m => m.LibroModule),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
