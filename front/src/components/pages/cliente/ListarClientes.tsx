import { useEffect, useState } from "react";
import { Cliente } from "../../../model/Cliente";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function ListarClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    buscarClientesAPI();
  }, []);

  async function buscarClientesAPI() {
    try {
      const resposta = await axios.get("http://localhost:5192/api/restaurante/cliente/listar");
      setClientes(resposta.data);
    } catch (error) {
      console.log(error);
    }
  }

  function removerCliente(id: any) {
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
          await axios.delete(`http://localhost:5192/api/restaurante/cliente/remover/${id}`);
          setClientes(clientes.filter((c) => c.id !== id));
          Swal.fire("Deletado!", "O cliente foi removido.", "success");
        } catch (error) {
          Swal.fire("Erro", "Erro ao deletar o cliente", "error");
        }
      }
    });
  }

  return (
    <div id="listar_clientes">
      <h1>Lista de Clientes</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Email</th>
            <th>Remover</th>
            <th>Editar</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.email}</td>
              <td>
                <button onClick={() => removerCliente(cliente.id!)}>
                  Remover
                </button>
              </td>
              <td>
                <Link
                  to={`/cliente/alterar/${cliente.id}`}
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
export default ListarClientes;