import { Cliente } from "./Cliente";
import { Mesa } from "./Mesa";

<<<<<<< HEAD
export interface Reserva {
    reservaId: number;
    dataHoraInicio: string;
    dataHoraFim: string;
=======
export interface Reserva{
    id?: number;
    dataInicio: string;
    dataFim: string;
>>>>>>> 615a181e14b8627cde9af451e510e617090ee95f
    clienteId: number;
    mesaId: number;
    cliente?: Cliente;
    mesa?: Mesa;
}