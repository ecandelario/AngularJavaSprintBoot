import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LibroComponent } from './pages/libro/libro.component';

const routes: Routes = [
  {
    path: '',
    component: LibroComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibroRoutingModule { }
