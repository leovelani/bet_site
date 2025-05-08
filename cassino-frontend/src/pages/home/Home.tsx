import React, { useEffect, useState } from "react";
import "./Home.css"; // Seu CSS continua sendo importado para os outros estilos
import { useNavigate } from "react-router-dom";

// IMPORTANTE: Ajuste este caminho relativo se necessário.
// Este caminho assume que Home.tsx está em 'src/pages/home/'
// e a imagem está em 'public/images/'.
// '..' sobe um nível.
// ../../../ sobe de 'home' para 'pages', de 'pages' para 'src', de 'src' para 'cassino-frontend'
// A partir de 'cassino-frontend', acessamos 'public/images/fundo_urubu.png'
// No entanto, para arquivos em 'public' quando importados no JS/TS,
// você geralmente os trata como se estivessem na raiz após o build.
// Create React App e Vite lidam com isso de formas específicas.

// TENTATIVA DE IMPORTAÇÃO CORRETA PARA ARQUIVOS EM 'public' (se usando CRA ou similar):
// O React geralmente espera que você coloque imagens que são importadas no JS/TS dentro da pasta `src`.
// Se a imagem PRECISA ficar em `public`, a forma de referenciá-la no JS é diferente de referenciá-la no CSS.

// SOLUÇÃO MAIS SEGURA E PADRÃO REACT:
// Mova 'fundo_urubu.png' para dentro da pasta 'src', por exemplo, 'src/assets/images/fundo_urubu.png'
// E então importe assim:
// import fundoUrubuSrc from '../../assets/images/fundo_urubu.png';

// SE A IMAGEM DEVE PERMANECER EM 'public/images/':
// A forma de obter o caminho para ela no JS é usando process.env.PUBLIC_URL
const fundoUrubuPath = process.env.PUBLIC_URL + "/images/fundo_urubu.png";


const Home: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      navigate("/");
    } else {
      setUsername(storedUsername || "Apostador(a)");
    }
  }, [navigate]); // Corrigido warning do ESLint adicionando navigate aqui

  const handleGameClick = (gamePath: string) => {
    navigate(gamePath);
  };

  // Estilo inline para o container da home, aplicando a imagem de fundo
  const homeContainerStyle: React.CSSProperties = {
    backgroundImage: `url(${fundoUrubuPath})`,
  };

  return (
    <div className="home-container" style={homeContainerStyle}>
      <div className="home-content-wrapper">
        <h1>🎰 Bem-vindo ao Urubu da Bet!</h1>
        <p>
          Olá, <strong>{username}</strong>! Escolha um dos jogos abaixo e teste
          sua sorte!
        </p>

        <div className="games-container">
          <div
            className="game-card"
            onClick={() => handleGameClick("/coinflip")}
          >
            <h3>🪙 Coin Flip</h3>
            <p>Cara ou coroa? A sorte está lançada! Desafie o destino.</p>
            <button>Jogar Coin Flip</button>
          </div>

          <div
            className="game-card"
            onClick={() => handleGameClick("/roulette")}
          >
            <h3>♣️♥️ Roleta</h3>
            <p>Aposte nos seus números da sorte e veja a roda girar!</p>
            <button>Jogar Roleta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;