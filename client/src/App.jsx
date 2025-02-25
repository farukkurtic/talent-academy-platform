import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import Register from "./pages/register.jsx";
import UsloviKoristenja from "./pages/uslovi-koristenja.jsx";
import Kontakt from "./pages/kontakt.jsx";
import Feed from "./pages/feed.jsx";
import "./App.css";

import Modal from "react-modal";
Modal.setAppElement("#root");

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registracija" element={<Register />} />
          <Route path="/uslovi-koristenja" element={<UsloviKoristenja />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/feed" element={<Feed />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
