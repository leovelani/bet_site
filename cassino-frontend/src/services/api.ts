import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

export const fetchGameData = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do jogo", error);
    return null;
  }
};

// Criar novo usuário
export const createUser = async (username: string, balance: number) => {
  try {
    const response = await api.post("/user_service/inser_user", null, {
      params: { username, balance },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário", error);
    return null;
  }
};

// Buscar todos os usuários (para lista de perfis)
export const fetchUsers = async () => {
  try {
    const response = await api.get("/user_service/get_users");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuários", error);
    return [];
  }
};

// Consultar saldo do usuário
export const fetchBalance = async (userId: number) => {
  try {
    const response = await api.get(`/balance/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar saldo", error);
    return null;
  }
};

// Apostar no Coin Flip
export const postCoinFlip = async (userId: number, amount: number, choice: string) => {
  try {
    const response = await api.post("/bet/bet/coinflip", null, {
      params: { user_id: userId, amount, choice },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao apostar no Coin Flip", error);
    return null;
  }
};

// Apostar na Roleta
export const postRoleta = async (userId: number, amount: number, choice: number) => {
  try {
    const response = await api.post("/bet/bet/roleta", null, {
      params: { user_id: userId, amount, choice },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao apostar na Roleta", error);
    return null;
  }
};

export default api;
