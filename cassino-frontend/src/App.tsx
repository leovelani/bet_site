import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Home from "./pages/Home";
import CoinFlip from "./games/CoinFlip/CoinFlip";
import Roulette from "./games/Roulette/Roulette";
import { GameFactory } from "./games/GameFactory";
import Navbar from "./components/Navbar";;

const GamePage: React.FC = () => {
  const { gameType } = useParams<{ gameType: "coinflip" | "roulette" }>();
  return GameFactory.createGame(gameType as "coinflip" | "roulette");
};

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coinflip" element={<CoinFlip />} />
        <Route path="/roulette" element={<Roulette />} />
      </Routes>
    </Router>
  );
};

export default App;
