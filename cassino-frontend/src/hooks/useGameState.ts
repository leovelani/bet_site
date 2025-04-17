import { useState } from "react";
import { IdleState } from "./CoinFlipStates";

export function useGameState() {
  const [state, setState] = useState<any>(new IdleState());
  return { state, setState };
}
