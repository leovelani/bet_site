import { createContext, useState } from "react";

interface GameContextProps {
  balance: number;
  setBalance: (value: number) => void;
}

const GameContext = createContext<GameContextProps | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState(1000000); // Saldo inicial fictício

  return (
    <GameContext.Provider value={{ balance, setBalance }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
