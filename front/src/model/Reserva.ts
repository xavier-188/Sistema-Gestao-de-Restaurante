import { Cliente } from "./Cliente";
import { Mesa } from "./Mesa";

export interface Reserva{
    id?: number;
    dataInicio: string;
    dataFim: string;
    clienteId: number;
    mesaId: number;
    cliente?: Cliente;
    mesa?: Mesa;
}