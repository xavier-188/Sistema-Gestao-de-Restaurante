import { useEffect, useState } from "react";
import { Mesa } from "../../../model/Mesa";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function ListarMesas() {
    const [mesas, setMesas] = useState<Mesa[]>([]);

    useEffect(() => {
        buscarMesasAPI();
    }, []);

    async function buscarMesasAPI() {
        try {
            const resposta = await axios.get("http://localhost:5192/api/restaurante/mesa/listar");
            setMesas(resposta.data);
        } catch (error) {
            console.log(error);
        }
    }

    function removerMesa(id: any) {
        Swal.fire({
            title: "Tem certeza?",
            text: "Você não poderá reverter isso!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:5192/api/restaurante/mesa/remover/${id}`);
                    setMesas(mesas.filter((m) => m.id !== id));
                    Swal.fire("Deletado!", "A mesa foi removida.", "success");
                } catch (error) {
                    Swal.fire("Erro", "Erro ao deletar a mesa.", "error");
                }
            }
        });
    }

    return (
        <div id="listar_mesas">
            <h1>Lista de Mesas</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Número</th>
                        <th>Capacidade</th>
                        <th>Remover</th>
                        <th>Editar</th>
                    </tr>
                </thead>
                <tbody>
                    {mesas.map((mesa) => (
                        <tr key={mesa.id}>
                            <td>{mesa.id}</td>
                            <td>{mesa.numero}</td>
                            <td>{mesa.capacidade}</td>
                            <td>
                                <button onClick={() => removerMesa(mesa.id!)}>Remover</button>
                            </td>
                            <td>
                                <Link to={`/mesa/alterar/${mesa.id}`} className="btn-editar">
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
export default ListarMesas;