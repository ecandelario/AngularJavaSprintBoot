import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutorRoutingModule } from './autor-routing.module';
import { AutorComponent } from './pages/autor/autor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    AutorComponent
  ],
  imports: [
    CommonModule,
    AutorRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
  ]
})
export class AutorModule { }
