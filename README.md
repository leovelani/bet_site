# bet_site

Repositório criado afim de documentar o projeto desenvolvido durante a matéria de Arquitetura de Software em Engenharia de Software. O intuito do projeto é a criação de um site de jogos e apostas, estruturando o código com os padrões GOF.

| GOF       | Objetivo      
|---------------|---------------|
| Factory Method       | Criar diferentes jogos (Coin Flip, Roleta)      
| Singleton | Garantir um único estado da Roleta
| Prototype | Duplicar apostas sem recriar objetos manualmente
| Bridge | Separar a lógica dos jogos do frontend
| Composite | Organizar os jogos no React como componentes reutilizáveis
| Adapter | Conectar APIs externas sem modificar a lógica interna
| State | Controlar os estados do jogo
| Strategy | Diferentes estratégias de apostas
| Command | Registrar apostas e jogadas
| Observer | Notificar jogadores dos resultados

Ferramentas:
- IDE: VSCODE
- Framework: FastAPI
- Biblioteca: React
- Linguagem: Python e Typescript

Integrantes:
- Leonardo Gomes Velani
- Renatão
- Covaleski
- Lucas Campos Goshi
- Nicolas Lopes
