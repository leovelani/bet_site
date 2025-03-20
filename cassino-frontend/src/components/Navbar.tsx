import React, { useContext } from "react";
import { Link } from "react-router-dom";
import GameContext from "../context/GameContext";

const Navbar: React.FC = () => {
  const gameContext = useContext(GameContext);

  if (!gameContext) return null;

  const { balance } = gameContext;

  return (
    <nav style={{ padding: "10px", backgroundColor: "#222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <Link to="/" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Home</Link>
        <Link to="/coinflip" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Coin Flip</Link>
        <Link to="/roulette" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Roleta</Link>
      </div>
      <div style={{ color: "white", marginRight: "15px" }}>
        💰 Saldo: ${balance.toFixed(2)}
      </div>
    </nav>
  );
};

export default Navbar;
