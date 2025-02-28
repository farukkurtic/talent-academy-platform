import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import Register from "./pages/register.jsx";
import UsloviKoristenja from "./pages/uslovi-koristenja.jsx";
import Kontakt from "./pages/kontakt.jsx";
import Feed from "./pages/feed.jsx";
import Details from "./pages/detalji.jsx";
import DetaljiFinalno from "./pages/detalji-finalno.jsx";
import Login from "./pages/login.jsx";

import "./App.css";

import Modal from "react-modal";
Modal.setAppElement("#root");

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registracija" element={<Register />} />
          <Route path="/uslovi-koristenja" element={<UsloviKoristenja />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/profil-detalji" element={<Details />} />
          <Route path="/profil-detalji-dodatno" element={<DetaljiFinalno />} />
          <Route path="/prijava" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
