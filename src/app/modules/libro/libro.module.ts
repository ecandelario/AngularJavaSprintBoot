import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LibroRoutingModule } from './libro-routing.module';
import { LibroComponent } from './pages/libro/libro.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    LibroComponent
  ],
  imports: [
    CommonModule,
    LibroRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
  ]
})
export class LibroModule { }
