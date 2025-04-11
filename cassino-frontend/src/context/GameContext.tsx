import { createContext, useState, useEffect } from "react";
import api from "../services/api";

interface GameContextProps {
  balance: number;
  setBalance: (value: number) => void;
}

const GameContext = createContext<GameContextProps | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState<number>(0); // começa zerado

  useEffect(() => {
    const fetchUserBalance = async () => {
      const userId = localStorage.getItem("user_id");
      if (userId) {
        try {
          const response = await api.get(`/user/balance/${userId}`);
          setBalance(response.data.balance);
        } catch (err) {
          console.error("Erro ao buscar saldo inicial:", err);
        }
      }
    };

    fetchUserBalance();
  }, []);

  return (
    <GameContext.Provider value={{ balance, setBalance }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
