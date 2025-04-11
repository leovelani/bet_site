// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import CoinFlip from "./games/CoinFlip/CoinFlip";
import Roulette from "./games/Roulette/Roulette";
import Perfil from "./pages/perfil/Perfil";
import Layout from "./components/Layout";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota sem Navbar */}
        <Route path="/" element={<Perfil />} />

        {/* Rotas com Navbar dentro do Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/coinflip" element={<CoinFlip />} />
          <Route path="/roulette" element={<Roulette />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
