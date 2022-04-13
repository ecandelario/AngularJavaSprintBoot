import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutorComponent } from './pages/autor/autor.component';

const routes: Routes = [
  {
    path: '',
    component: AutorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutorRoutingModule { }
