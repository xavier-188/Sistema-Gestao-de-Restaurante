import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Cliente } from "../../../model/Cliente";
import { Mesa } from "../../../model/Mesa";
import { Reserva } from "../../../model/Reserva";
import Swal from "sweetalert2";
import axios from "axios";

function EditarReserva() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);

  const [clienteId, setClienteId] = useState("");
  const [mesaId, setMesaId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    carregarListas();
    carregarReserva();
  }, []);

  async function carregarListas() {
    try {
      const clienteResposta = await axios.get("http://localhost:5192/api/restaurante/cliente/listar");
      if (Array.isArray(clienteResposta.data))
        setClientes(clienteResposta.data);

      const mesaResposta = await axios.get("http://localhost:5192/api/restaurante/mesa/listar");
      if (Array.isArray(mesaResposta.data))
        setMesas(mesaResposta.data);
    } catch (error) {
      console.log("Erro ao carregar listas auxiliares");
    }
  }

  async function carregarReserva() {
    try {
      const resposta = await axios.get(`http://localhost:5192/api/restaurante/reserva/buscar/${id}`);
      const dados: Reserva = resposta.data;

      setClienteId(dados.clienteId.toString());
      setMesaId(dados.mesaId.toString());

      if (dados.dataHoraInicio) {
        const inicioFormatado = new Date(dados.dataHoraInicio)
          .toISOString()
          .slice(0, 16);
        setDataInicio(inicioFormatado);
      }

      if (dados.dataHoraFim) {
        const fimFormatado = new Date(dados.dataHoraFim)
          .toISOString()
          .slice(0, 16);
        setDataFim(fimFormatado);
      }
    } catch (error) {
      console.log("Erro ao buscar reserva");
    }
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    const reservaEditada: Reserva = {
      reservaId: parseInt(id!),
      clienteId: parseInt(clienteId),
      mesaId: parseInt(mesaId),
      dataHoraInicio: dataInicio,
      dataHoraFim: dataFim,
    };

    try {
      await axios.patch(`http://localhost:5192/api/restaurante/reserva/alterar/${id}`, reservaEditada);

      Swal.fire({
        title: "Sucesso!",
        text: "Reserva alterada com sucesso!",
        icon: "success",
        confirmButtonColor: "#27ae60",
      }).then(() => {
        navigate("/reserva/listar");
      });
    } catch (erro: any) {
      const mensagemErro =
        erro.response?.data || "Erro ao editar reserva.";

      Swal.fire({
        title: "Erro!",
        text:
          typeof mensagemErro === "string"
            ? mensagemErro
            : JSON.stringify(mensagemErro),
        icon: "error",
        confirmButtonColor: "#e74c3c",
      });
    }
  }

  return (
    <div>
      <h1>Editar Reserva</h1>
      <form onSubmit={salvar}>
        <div>
          <label>Cliente:</label>
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            required
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
            value={mesaId}
            onChange={(e) => setMesaId(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione uma mesa
            </option>
            {mesas.map((m) => (
              <option key={m.id} value={m.id}>
                Mesa {m.numero}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Data Início:</label>
          <input
            type="datetime-local"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Data Fim:</label>
          <input
            type="datetime-local"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
          />
        </div>

        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}

export default EditarReserva;