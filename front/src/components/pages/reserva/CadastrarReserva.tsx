import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cliente } from "../../../model/Cliente";
import { Mesa } from "../../../model/Mesa";
import { Reserva } from "../../../model/Reserva";
import Swal from "sweetalert2";
import axios from "axios";
import { ReservaRequest } from "../../../model/ReservaRequest";

function CadastrarReserva() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [mesas, setMesas] = useState<Mesa[]>([]);
    const [clienteId, setClienteId] = useState("");
    const [mesaId, setMesaId] = useState("");
    const [dataInicio, setDataInicio] = useState("");

    useEffect(() => {
        async function carregarDados() {
            try {
                const clienteResposta = await axios.get("http://localhost:5192/api/restaurante/cliente/listar");
                setClientes(clienteResposta.data);

                const mesaResposta = await axios.get("http://localhost:5192/api/restaurante/mesa/listar");
                setMesas(mesaResposta.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
            }
        }

        carregarDados();
    }, []);

    async function cadastrar(e: React.FormEvent) {
        e.preventDefault();

        const novaReserva: ReservaRequest = {
            clienteId: parseInt(clienteId),
            mesaId: parseInt(mesaId),
            dataHoraInicio: dataInicio,
        };

        try {
            console.log(novaReserva);
            await axios.post("http://localhost:5192/api/restaurante/reserva/cadastrar", novaReserva);

            Swal.fire({
                title: "Sucesso!",
                text: "Reserva realizada com sucesso!",
                icon: "success",
                confirmButtonColor: "#27ae60",
            }).then(() => {
                navigate("/reserva/listar");
            });
        } catch (error: any) {
            Swal.fire({
                title: "Atenção!",
                text: error.response?.data || "Erro ao cadastrar reserva.",
                icon: "warning",
                confirmButtonColor: "#e74c3c",
            });
        }
    }

    return (
        <div>
            <h2>Nova Reserva</h2>
            <form onSubmit={cadastrar}>
                <div>
                    <label>Cliente:</label>
                    <select
                        onChange={(e) => setClienteId(e.target.value)}
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Selecione um cliente
                        </option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Mesa:</label>
                    <select
                        onChange={(e) => setMesaId(e.target.value)}
                        required
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Selecione uma mesa
                        </option>
                        {mesas.map((m) => (
                            <option key={m.id} value={m.id}>
                                Mesa {m.numero} (Capacidade: {m.capacidade})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Data e Hora de Entrada:</label>
                    <input
                        type="datetime-local"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Reservar</button>
            </form>
        </div>
    );
}

export default CadastrarReserva;