import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UnreadMessagesProvider } from "../contexts/UnreadMessagesContext.jsx";

import Home from "./pages/home.jsx";
import Register from "./pages/register.jsx";
import UsloviKoristenja from "./pages/uslovi-koristenja.jsx";
import Kontakt from "./pages/kontakt.jsx";
import Feed from "./pages/feed.jsx";
import Details from "./pages/detalji.jsx";
import DetaljiFinalno from "./pages/detalji-finalno.jsx";
import Login from "./pages/login.jsx";
import Profile from "./pages/korisnik-profil.jsx";
import MyProfile from "./pages/mojProfil.jsx";
import Filters from "./pages/filteri.jsx";
import Chat from "./pages/chat.jsx";
import NotFound from "./pages/not-found.jsx";
import KreirajRadionicu from "./pages/kreiraj-radionicu.jsx";

import ProtectedRoute from "./pages/protectedRoute.jsx";

import "./App.css";

import Modal from "react-modal";
import Radionice from "./pages/radionice.jsx";
import WorkshopDetails from "./pages/radionice-detalji.jsx";
Modal.setAppElement("#root");

function App() {
  return (
    <UnreadMessagesProvider>
      {" "}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/registracija" element={<Register />} />
          <Route path="/prijava" element={<Login />} />
          <Route path="/uslovi-koristenja" element={<UsloviKoristenja />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil-detalji"
            element={
              <ProtectedRoute>
                <Details />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil-detalji-dodatno"
            element={
              <ProtectedRoute>
                <DetaljiFinalno />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profil/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/moj-profil"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/svi-korisnici"
            element={
              <ProtectedRoute>
                <Filters />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/radionice"
            element={
              <ProtectedRoute>
                <Radionice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kreiraj-radionicu"
            element={
              <ProtectedRoute>
                <KreirajRadionicu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/radionice/:workshopId"
            element={
              <ProtectedRoute>
                <WorkshopDetails />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </UnreadMessagesProvider>
  );
}

export default App;
