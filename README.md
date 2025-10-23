# ⚽ Sistema de Simulação do Campeonato La Liga

Sistema completo em Python para simulação de temporada do campeonato espanhol La Liga, incluindo classificação, partidas e estatísticas.

## 🎯 Funcionalidades

- **✅ Simulação de Partidas**: Geração de resultados realistas com gols baseados em força do time
- **✅ Tabela de Classificação**: Atualização automática com pontos, vitórias, derrotas e saldo de gols
- **✅ Sistema de Pontuação**: Implementação das regras oficiais do futebol (3pt vitória, 1pt empate)
- **✅ Estatísticas Detalhadas**: Gols pró/contra, saldo, aproveitamento
- **✅ Persistência de Dados**: Salvamento e carregamento do progresso do campeonato

## 🛠 Tecnologias Utilizadas

- **Python 3**
- **Programação Orientada a Objetos** (Classes Time, Partida, Campeonato)
- **Manipulação de Arquivos** (JSON para persistência)
- **Algoritmos de Simulação** e Cálculos Estatísticos

## 🚀 Como Executar

```bash
# Clone o repositório
git clone https://github.com/Duffyjhon/CampeonatoLaLiga.git

# Execute o sistema
python main.py

📁 Estrutura do Projeto
CampeonatoLaLiga/
├── main.py                 # Arquivo principal - inicia a simulação
├── campeonato.py          # Classe Campeonato - gerencia toda a competição
├── time.py                # Classe Time - representa cada time com estatísticas
├── partida.py             # Classe Partida - simula jogos entre times
├── dados_campeonato.json  # Base de dados com informações dos times
└── README.md              # Documentação do projeto

💡 Conceitos Aplicados
POO (Programação Orientada a Objetos)

Manipulação de JSON

Algoritmos de Simulação

Estruturas de Dados

Persistência de Dados

👨💻 Autor
João Vitor Mendonça
Estudante de Análise e Desenvolvimento de Sistemas
