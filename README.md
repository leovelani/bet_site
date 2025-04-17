# 🎰 Projeto Cassino - FastAPI + React

Este projeto é um cassino simples com os jogos **Coin Flip** e **Roleta**, utilizando **FastAPI** no backend e **React (TypeScript)** no frontend.

## 👥 Integrantes
- **Lucas Goshi**
- **Leonardo Gomes Velani**
- **Guilherme Covaleki**
- **Renato Sussumu**
- **Nicolas Lopes**

## 📌 Tecnologias Utilizadas

| Tecnologia  | Descrição |
|------------|--------------------------------|
| **FastAPI**    | Backend em Python |
| **PostgreSQL** | Banco de dados |
| **React**      | Frontend do cassino |
| **TypeScript** | Tipagem segura no frontend |
| **Axios**      | Consumo da API |
| **Docker**     | Containerização do backend e frontend |

## 🏗️ Padrões GoF Utilizados

| Padrão GoF       | Objetivo                                                         | Frontend | Backend | Arquivo(s) Relacionado(s) |
|------------------|------------------------------------------------------------------|----------|---------|-----------------------------|
| **Factory Method** | Criar diferentes jogos (Coin Flip, Roleta).                      | ✅        | ✅       | GameFactory.tsx, bet_service.py |
| **Singleton**      | Garantir uma única instância de um objeto.                      | ❌        | ✅       | database.py |
| **Prototype**      | Duplicar apostas sem recriar objetos manualmente.               | ❌        | ❌       | — |
| **Bridge**         | Separar a lógica dos jogos do frontend.                         | ✅        | ❌       | useGameState.ts, CoinFlipStates.ts  |
| **Composite**      | Organizar os jogos no React como componentes reutilizáveis.     | ✅        | ❌       | GameFactory.tsx |
| **Adapter**        | Conectar APIs externas sem modificar a lógica interna.          | ✅        | ❌       | api.ts (Axios) |
| **State**          | Controlar os estados do jogo.                                   | ✅        | ❌       | useGameState.ts, CoinFlipStates.ts |
| **Strategy**       | Diferentes estratégias de apostas.                              | ❌        | ✅       | bet_service.py |
| **Command**        | Registrar apostas e jogadas.                                    | ❌        | ✅       | register_bet em bet_service.py |
| **Observer**       | Notificar jogadores dos resultados.                             | Parcial   | Parcial  | update_balance, render condicional |

## 🛠️ Como Rodar o Projeto

- Baixar o docker

- Rodar o docker

```bash
docker-compose up --build
```
- Para acessar o servidor do backend:

```bash
http://localhost:8000/docs
```
- Para acessar o servidor do frontend:

```bash
http://localhost:3000
```
- Em caso de atualizar o back, precisar dar "CTRL + C" e rodar o comando do docker novamente