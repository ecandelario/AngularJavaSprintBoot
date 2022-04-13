import { Injectable } from '@angular/core';
import { autorValidMessagesInterface } from '../interface/autor';

@Injectable({
  providedIn: 'root'
})
export class AutorService {

  autor_validation: autorValidMessagesInterface = {
    nombreCompleto: [
      { type: 'required', message: 'Nombre del autor es requerido.' },
      { type: 'minlength', message: 'Debe contener minimo tres caracteres.' },
    ],
  };

  constructor() {}

  get autorValidationsMessages(): autorValidMessagesInterface {
    return this.autor_validation;
  }
}
