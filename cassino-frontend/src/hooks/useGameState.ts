import { useState } from "react";

export function useGameState() {
    const [state, setState] = useState(null);
    return {state, setState};
}