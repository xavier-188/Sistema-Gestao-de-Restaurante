import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reserva } from "../../../model/Reserva";
import Swal from "sweetalert2";
import axios from "axios";

function ListarReservas() {
    const [reservas, setReservas] = useState<Reserva[]>([]);

    useEffect(() => {
        carregarReservas();
        console.log(reservas);
    }, []);

    async function carregarReservas() {
        try {
            
            const resposta = await axios.get("http://localhost:5192/api/restaurante/reserva/listar");
            if (Array.isArray(resposta.data)) {
                setReservas(resposta.data);
                
            }
        } catch (error) {
            console.log("Erro ao carregar reservas ou lista vazia");
        }
    }

    function deletar(id: number) {
        Swal.fire({
            title: "Cancelar Reserva?",
            text: "Essa ação não pode ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, cancelar!",
            cancelButtonText: "Voltar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5192/api/restaurante/reserva/remover/${id}`);
                    setReservas(reservas.filter((x) => x.reservaId !== id));
                    Swal.fire(
                        "Cancelada!",
                        "A reserva foi cancelada com sucesso.",
                        "success"
                    );
                } catch (error) {
                    Swal.fire("Erro", "Erro ao cancelar a reserva.", "error");
                }
            }
        });
    }

    return (
        <div id="listar_reservas">
            <h1>Lista de Reservas</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Data Inicio</th>
                        <th>Data Fim</th>
                        <th>Cliente</th>
                        <th>Mesa</th>
                        <th>Cancelar</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {reservas.map((reserva) => (
                        <tr key={reserva.reservaId}>
                            <td>{reserva.reservaId}</td>
                            <td>
                                {new Date(reserva.dataHoraInicio).toLocaleString("pt-BR")}
                            </td>

                            <td>
                                {new Date(reserva.dataHoraFim).toLocaleString("pt-BR")}
                            </td>
                            <td>{reserva.cliente?.nome}</td>
                            <td>{reserva.mesa?.numero}</td>
                            <td>
                                <button onClick={() => deletar(reserva.reservaId!)}>Cancelar</button>
                            </td>
                            <td>
                                <Link
                                    to={`/reserva/alterar/${reserva.reservaId}`}
                                    className="btn-editar"
                                >
                                    Editar
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default ListarReservas;