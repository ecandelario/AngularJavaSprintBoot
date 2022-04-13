import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditorialComponent } from './pages/editorial/editorial.component';

const routes: Routes = [
  {
    path: '',
    component: EditorialComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorialRoutingModule { }
