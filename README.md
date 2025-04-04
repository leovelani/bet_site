# 🎰 Projeto Cassino - FastAPI + React

Este projeto é um cassino simples com os jogos **Coin Flip** e **Roleta**, utilizando **FastAPI** no backend e **React (TypeScript)** no frontend.

## 👥 Integrantes
- **Lucas Goshi**
- **Leonardo Gomes Velani**
- **Guilherme Covaleski**
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

| Padrão GoF      | Objetivo | 
|----------------|------------------------------------------------|
| **Factory Method** | Criar diferentes jogos (Coin Flip, Roleta). | ✅ | ❌ |
| **Singleton** | Garantir uma única instância de um objeto. | ❌ | ❌ |
| **Prototype** | Duplicar apostas sem recriar objetos manualmente. | ❌ | ❌ |
| **Bridge** | Separar a lógica dos jogos do frontend. | ❌ | ❌ |
| **Composite** | Organizar os jogos no React como componentes reutilizáveis. | ❌ | ❌ |
| **Adapter** | Conectar APIs externas sem modificar a lógica interna. | ❌ | ❌ |
| **State** | Controlar os estados do jogo. | ❌ | ❌ |
| **Strategy** | Diferentes estratégias de apostas. | ❌ | ❌ |
| **Command** | Registrar apostas e jogadas. | ❌ | ❌ |
| **Observer** | Notificar jogadores dos resultados. | ❌ | ❌ |

## 🛠️ Como Rodar o Projeto

### 🔹 **Rodando o Backend**
Baixar o docker.

Primeiro criar o banco de dados no postgres
Nome : cassino_db

Criar a imagem do docker :
docker build -t fastapi_cassino .

Rodar o docker:
docker run -p 8000:8000 fastapi_cassino

Depois ele vai ficar rodando indefinidamente , para parar ele aperte ctrl+c

### 🔹 **Rodando o Frontend**
```npx create-react-app cassino-frontend --template typescript``` 
