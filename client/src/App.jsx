import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home.jsx";
import Register from "./pages/register.jsx";
import UsloviKoristenja from "./pages/uslovi-koristenja.jsx";
import Login from "./pages/login.jsx";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registracija" element={<Register />} />
          <Route path="/uslovi-koristenja" element={<UsloviKoristenja />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
