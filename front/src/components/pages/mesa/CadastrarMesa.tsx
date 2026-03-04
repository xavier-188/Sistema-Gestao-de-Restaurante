import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function CadastrarMesa() {
  const [numero, setNumero] = useState("");
  const [capacidade, setCapacidade] = useState("");
  const navigate = useNavigate();

  function enviarMesa(event: any) {
    event.preventDefault();
    submeterMesaAPI();
  }

  async function submeterMesaAPI() {
    try {
      const mesa = {
        numero: numero,
        capacidade: capacidade,
      };

      await axios.post("http://localhost:5192/api/restaurante/mesa/cadastrar", mesa);

      Swal.fire({
        title: "Sucesso!",
        text: "Mesa cadastrada com sucesso!",
        icon: "success",
        confirmButtonColor: "#27ae60",
      }).then(() => {
        navigate("/mesa/listar");
      });
    } catch (error: any) {
      Swal.fire("Erro!", "Erro ao cadastrar mesa.", "error");
    }
  }

  return (
    <div>
      <h1>Cadastrar Mesa</h1>
      <form onSubmit={enviarMesa}>
        <div>
          <label>Número:</label>
          <input
            type="text"
            onChange={(e: any) => setNumero(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Capacidade:</label>
          <input
            type="number"
            onChange={(e: any) => setCapacidade(e.target.value)}
            required
          />
        </div>
        <div>
          <button type="submit">Cadastrar</button>
        </div>
      </form>
    </div>
  );
}
export default CadastrarMesa;