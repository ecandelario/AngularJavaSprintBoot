import { Injectable } from '@angular/core';
import { libroValidMessagesInterface } from '../interface/libro';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  libro_validation: libroValidMessagesInterface = {
    titulo: [
      { type: 'required', message: 'Título es requerido.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
    genero: [
      { type: 'required', message: 'Género es requerida.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
    numeroPaginas: [
      { type: 'required', message: 'Número de página es requerida.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
    editorial: [
      { type: 'required', message: 'El nombre de la editorial es requerida.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
    autor: [
      { type: 'required', message: 'Elnombre del autor es requerida.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
  };

  constructor() {}

  get libroValidationsMessages(): libroValidMessagesInterface {
    return this.libro_validation;
  }
}
