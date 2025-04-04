import React, { useContext } from "react";
import { Link } from "react-router-dom";
import GameContext from "../context/GameContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const gameContext = useContext(GameContext);

  if (!gameContext) return null;

  const { balance } = gameContext;

  return (
    <nav>
      <div>
        <Link to="/">Home</Link>
        <Link to="/coinflip">Coin Flip</Link>
        <Link to="/roulette">Roleta</Link>
      </div>
      <div className="saldo">
        💰 Saldo: ${balance.toFixed(2)}
      </div>
    </nav>
  );
};

export default Navbar;
