<<<<<<< HEAD
import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

import ListarClientes from "./components/pages/cliente/ListarClientes";
import CadastrarCliente from "./components/pages/cliente/CadastrarCliente";
import EditarCliente from "./components/pages/cliente/EditarCliente";

import ListarMesas from "./components/pages/mesa/ListarMesas";
import CadastrarMesa from "./components/pages/mesa/CadastrarMesa";
import EditarMesa from "./components/pages/mesa/EditarMesa";

import ListarReservas from "./components/pages/reserva/ListarRerservas";
import CadastrarReserva from "./components/pages/reserva/CadastrarReserva";
import EditarReserva from "./components/pages/reserva/EditarReserva";
import "./App.css"
=======
import React from 'react';

import './App.css';
>>>>>>> 615a181e14b8627cde9af451e510e617090ee95f

function App() {
  return (
    <div className="App">
<<<<<<< HEAD
      <h1>Restaurante</h1>
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Lista de Clientes</Link>
            </li>
            <li>
              <Link to="/cliente/cadastrar">Cadastrar Cliente</Link>
            </li>
            <li>
              <Link to="/mesa/listar">Lista de Mesas</Link>
            </li>
            <li>
              <Link to="/mesa/cadastrar">Cadastrar Mesa</Link>
            </li>
            <li>
              <Link to="/reserva/listar">Lista de Reservas</Link>
            </li>
            <li>
              <Link to="/reserva/cadastrar">Fazer Reserva</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<ListarClientes />}></Route>
          <Route
            path="/cliente/cadastrar"
            element={<CadastrarCliente />}
          ></Route>
          <Route
            path="/cliente/alterar/:id"
            element={<EditarCliente />}
          ></Route>

          <Route path="/mesa/listar" element={<ListarMesas />}></Route>
          <Route path="/mesa/cadastrar" element={<CadastrarMesa />}></Route>
          <Route path="/mesa/alterar/:id" element={<EditarMesa />}></Route>

          <Route path="/reserva/listar" element={<ListarReservas />}></Route>
          <Route
            path="/reserva/cadastrar"
            element={<CadastrarReserva />}
          ></Route>
          <Route
            path="/reserva/alterar/:id"
            element={<EditarReserva />}
          ></Route>
        </Routes>
      </BrowserRouter>
=======
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
>>>>>>> 615a181e14b8627cde9af451e510e617090ee95f
    </div>
  );
}

export default App;