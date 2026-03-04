import axios from "axios";
import { useEffect, useState } from "react";
import { Cliente } from "../../../model/Cliente";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

function EditarCliente() {
    const { id } = useParams();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        buscarClientesAPI();
    }, []);

    async function buscarClientesAPI() {
        try {
            const resposta = await axios.get(`http://localhost:5192/api/restaurante/cliente/buscar/${id}`);

            const dados = resposta.data;
            setNome(dados.nome || dados.Nome || "");
            setEmail(dados.email || dados.Email || "");
            setTelefone(dados.telefone || dados.Telefone || "");

            console.log("Dados carregados com sucesso:", dados);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error);
        }
    }
    function enviarCliente(event: any) {
        event.preventDefault();
        submeterClienteAPI();
    }

    async function submeterClienteAPI() {
        try {
            const cliente: Cliente = {
                nome: nome,
                email: email,
                telefone: telefone,
            };
            await axios.patch(`http://localhost:5192/api/restaurante/cliente/alterar/${id}`, cliente);

            Swal.fire({
                title: "Atualizado!",
                text: "Cliente editado com sucesso!",
                icon: "success",
                confirmButtonColor: "#27ae60",
            }).then(() => {
                navigate("/");
            });
        } catch (error: any) {
            Swal.fire("Erro!", "Erro ao editar cliente.", "error");
        }
    }

    return (
        <div>
            <h1>Editar Cliente</h1>
            <form onSubmit={enviarCliente}>
                <div>
                    <label>Nome:</label>
                    <input
                        value={nome}
                        onChange={(e: any) => setNome(e.target.value)}
                        type="text"
                        required
                    />
                </div>
                <div>
                    <label>E-Mail:</label>
                    <input
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                        type="email"
                        required
                    />
                </div>
                <div>
                    <label>Telefone:</label>
                    <input
                        value={telefone}
                        onChange={(e: any) => setTelefone(e.target.value)}
                        type="text"
                    />
                </div>
                <div>
                    <button type="submit">Alterar</button>
                </div>
            </form>
        </div>
    );
}
export default EditarCliente;