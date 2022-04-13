import { TypeErrorInterface } from "src/app/interfaces/type-error-interface";

export interface Editorial {
    id: number,
    nombre: string,
    direccion: string,
    telefono: string,
    email: string,
    maximoLibros: number
}

export interface editorialValidMessagesInterface {
    nombre: Array<TypeErrorInterface>;
    direccion: Array<TypeErrorInterface>;
    telefono: Array<TypeErrorInterface>;
    maximoLibros: Array<TypeErrorInterface>;
}