import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/home/Home";
import CoinFlip from "./games/CoinFlip/CoinFlip";
import Roulette from "./games/Roulette/Roulette";
import { GameFactory } from "./games/GameFactory";
import Navbar from "./components/Navbar";
import Perfil from "./pages/perfil/Perfil";

const App: React.FC = () => {
  const userId = localStorage.getItem("user_id");

  return (
    <Router>
      {userId && <Navbar />}

      <Routes>
        <Route path="/" element={<Perfil />} />

        <Route path="/home" element={<Home />} />
        <Route path="/coinflip" element={<CoinFlip />} />
        <Route path="/roulette" element={<Roulette />} />
      </Routes>
    </Router>
  );
};

export default App;
