import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditorialRoutingModule } from './editorial-routing.module';
import { EditorialComponent } from './pages/editorial/editorial.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    EditorialComponent
  ],
  imports: [
    CommonModule,
    EditorialRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
  ]
})
export class EditorialModule { }
