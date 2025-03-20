import React from "react";
import CoinFlip from "./CoinFlip/CoinFlip";
import Roulette from "./Roulette/Roulette";

export class GameFactory {
  static createGame(gameType: "coinflip" | "roulette") {
    switch (gameType) {
      case "coinflip":
        return <CoinFlip />;
      case "roulette":
        return <Roulette />;
      default:
        return <div>Jogo não encontrado</div>;
    }
  }
}
