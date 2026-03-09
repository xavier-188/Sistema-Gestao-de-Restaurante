import { Cliente } from "./Cliente";
import { Mesa } from "./Mesa";

export interface Reserva {
    reservaId: number;
    dataHoraInicio: string;
    dataHoraFim: string;
    clienteId: number;
    mesaId: number;
    cliente?: Cliente;
    mesa?: Mesa;
}