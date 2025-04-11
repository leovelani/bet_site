import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const storedUsername = localStorage.getItem("username");

    if (!userId) {
      navigate("/");
    } else {
      setUsername(storedUsername || "");
    }
  }, []);

  return (
    <div className="home-container">
      <h1>🎰 Bem-vindo ao Cassino Virtual!</h1>
      <p>Olá, <strong>{username}</strong>! Escolha um dos jogos no menu acima e teste sua sorte!</p>
      <p>Você pode apostar em Coin Flip ou Roleta.</p>
    </div>
  );
};

export default Home;
