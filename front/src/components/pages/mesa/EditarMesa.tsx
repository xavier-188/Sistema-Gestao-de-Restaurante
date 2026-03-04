import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditarMesa() {
  const { id } = useParams();
  const [numero, setNumero] = useState(0);
  const [capacidade, setCapacidade] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    buscarMesasAPI();
  }, []);

  async function buscarMesasAPI() {
    try {
      const resposta = await axios.get(`http://localhost:5192/api/restaurante/mesa/buscar/${id}`
      );
      setNumero(resposta.data.numero);
      setCapacidade(resposta.data.capacidade);
    } catch (error) {
      console.log(error);
    }
  }

  function enviarMesa(event: any) {
    event.preventDefault();
    submeterMesaAPI();
  }

  async function submeterMesaAPI() {
    try {
      const mesa = {
        numero,
        capacidade,
      };
      await axios.patch(`http://localhost:5219/api/restaurante/mesa/alterar/${id}`, mesa);

      Swal.fire({
        title: "Atualizado!",
        text: "Mesa editada com sucesso!",
        icon: "success",
        confirmButtonColor: "#27ae60",
      }).then(() => {
        navigate("/mesa/listar");
      });
    } catch (error: any) {
      Swal.fire("Erro!", "Erro ao editar mesa.", "error");
    }
  }

  return (
    <div>
      <h1>Editar Mesa</h1>
      <form onSubmit={enviarMesa}>
        <div>
          <label>Número:</label>
          <input
            type="number"
            value={numero}
            onChange={(e: any) => setNumero(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Capacidade:</label>
          <input
            type="number"
            value={capacidade}
            onChange={(e: any) => setCapacidade(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Editar</button>
        </div>
      </form>
    </div>
  );
}
export default EditarMesa;