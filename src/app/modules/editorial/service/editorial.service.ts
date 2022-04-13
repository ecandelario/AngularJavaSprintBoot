import { Injectable } from '@angular/core';
import { editorialValidMessagesInterface } from '../interface/editorial';

@Injectable({
  providedIn: 'root',
})
export class EditorialService {
  editorial_validation: editorialValidMessagesInterface = {
    nombre: [
      { type: 'required', message: 'Nombre es requerido.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
    direccion: [
      { type: 'required', message: 'La dirección de corespondencia es requerida.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
    telefono: [
      { type: 'required', message: 'El teléfono es requerido.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
    maximoLibros: [
      { type: 'required', message: 'El número máximo de libro es requerido.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
  };

  constructor() {}

  get editorialValidationsMessages(): editorialValidMessagesInterface {
    return this.editorial_validation;
  }
}
