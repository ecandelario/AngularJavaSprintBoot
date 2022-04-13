import { TypeErrorInterface } from 'src/app/interfaces/type-error-interface';

export interface Autor {
  id: number;
  nombreCompleto: string;
  fechaNacimiento: string;
  ciudadProcedencia: string;
  email: string;
}

export interface autorValidMessagesInterface {
  nombreCompleto: Array<TypeErrorInterface>;
}
