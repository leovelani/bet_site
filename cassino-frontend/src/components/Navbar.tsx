import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import GameContext from "../context/GameContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const gameContext = useContext(GameContext);
  const navigate = useNavigate();

  if (!gameContext) return null;

  const { balance } = gameContext;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav>
      <div>
        <Link to="/home">Home</Link>
        <Link to="/coinflip">Coin Flip</Link>
        <Link to="/roulette">Roleta</Link>
      </div>
      <div className="saldo">
        💰 Saldo: ${balance.toFixed(2)}{" "}
        <button className="logout-button" onClick={handleLogout}>
          Trocar Perfil
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
