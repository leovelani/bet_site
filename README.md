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

| Padrão GoF       | Objetivo                                                         | Frontend | Backend |
|------------------|------------------------------------------------------------------|----------|---------|
| **Factory Method** | Criar diferentes jogos (Coin Flip, Roleta).                      | ✅        | ❌       |
| **Singleton**      | Garantir uma única instância de um objeto.                      | ❌        | ❌       |
| **Prototype**      | Duplicar apostas sem recriar objetos manualmente.               | ❌        | ❌       |
| **Bridge**         | Separar a lógica dos jogos do frontend.                         | ❌        | ❌       |
| **Composite**      | Organizar os jogos no React como componentes reutilizáveis.     | ❌        | ❌       |
| **Adapter**        | Conectar APIs externas sem modificar a lógica interna.          | ❌        | ❌       |
| **State**          | Controlar os estados do jogo.                                   | ❌        | ❌       |
| **Strategy**       | Diferentes estratégias de apostas.                              | ❌        | ❌       |
| **Command**        | Registrar apostas e jogadas.                                    | ❌        | ❌       |
| **Observer**       | Notificar jogadores dos resultados.                             | ❌        | ❌       |

## 🛠️ Como Rodar o Projeto

### 🔹 **Rodando o Backend**
Baixar o docker.

Rodar o docker

docker-compose up --build

caso nao tenha instalado.

Instalar o Windows Subsystem for Linux (WSL).

wsl --install

para ver o servidor do fastapi vá para 

http://localhost:8000/docs

Depois ele vai ficar rodando indefinidamente , para parar ele aperte ctrl+c

### 🔹 **Rodando o Frontend**
```npx create-react-app cassino-frontend --template typescript``` 
