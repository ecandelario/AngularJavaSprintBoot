import { TypeErrorInterface } from "src/app/interfaces/type-error-interface";

export interface Libro {
    id: number,
    titulo: string,
    anios: number,
    genero: string,
    numeroPaginas: number,
    editorial: string,
    autor: string
}

export interface libroValidMessagesInterface {
    titulo: Array<TypeErrorInterface>;
    genero:  Array<TypeErrorInterface>;
    numeroPaginas: Array<TypeErrorInterface>;
    editorial:  Array<TypeErrorInterface>;
    autor:  Array<TypeErrorInterface>;
}