# ⚽ Campeonato La Liga - Pontos Corridos

Bem-vindo ao **Campeonato La Liga** --- um sistema completo para
gerenciamento de torneios em formato de **pontos corridos com jogos de
ida e volta**, totalmente estilizado com o tema clássico da La Liga! 🇪🇸

------------------------------------------------------------------------

## 🏆 Funcionalidades Principais

-   Cálculo automático de **pontos, vitórias, empates, derrotas, saldo
    de gols e gols marcados**\
-   Geração automática de **todas as rodadas (ida e volta)**\
-   Estilo visual moderno e inspirado na La Liga\
-   **Modo noturno** com design elegante\
-   **Botão de reiniciar campeonato**\
-   Integração com **Firebase Realtime Database** (para salvar dados do
    campeonato online)

------------------------------------------------------------------------

## 👥 Participantes

-   João\
-   Diney\
-   Pastor\
-   Heliton\
-   Davi\
-   Fulão\
-   Roni

------------------------------------------------------------------------

## 🧩 Tecnologias Utilizadas

-   **React.js**
-   **Firebase Realtime Database**
-   **TailwindCSS**
-   **Framer Motion** (para animações suaves)
-   **Lucide React** (ícones modernos)

------------------------------------------------------------------------

## 🚀 Como Executar o Projeto

1.  Clone o repositório:

    ``` bash
    git clone https://github.com/seuusuario/campeonato-laliga.git
    ```

2.  Instale as dependências:

    ``` bash
    npm install
    ```

3.  Configure o Firebase criando o arquivo:

    ``` bash
    src/firebase.js
    ```

    E adicione suas credenciais conforme o modelo:

    ``` javascript
    import { initializeApp } from "firebase/app";
    import { getDatabase } from "firebase/database";

    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      databaseURL: "SUA_DATABASE_URL",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_SENDER_ID",
      appId: "SEU_APP_ID"
    };

    const app = initializeApp(firebaseConfig);
    export const db = getDatabase(app);
    ```

4.  Inicie o projeto localmente:

    ``` bash
    npm start
    ```

------------------------------------------------------------------------

## 🧠 Lógica do Campeonato

Cada rodada é gerada automaticamente com confrontos equilibrados entre
todos os participantes.\
Os resultados são atualizados em tempo real e refletidos diretamente na
**tabela de classificação**.

Critérios de desempate: 1. Pontos 2. Saldo de Gols (SG) 3. Gols Pró (GP)
4. Ordem alfabética (nome do jogador)

------------------------------------------------------------------------

## 🌐 Salvar Dados Online

O projeto usa o **Firebase Realtime Database** para armazenar dados da
tabela e rodadas.\
Assim, **todos que acessarem o site** verão a mesma tabela atualizada.

------------------------------------------------------------------------

## 🔁 Reiniciar Campeonato

Ao clicar em **"Reiniciar Campeonato"**, todos os dados (placares e
classificação) são resetados, permitindo começar uma nova temporada.

------------------------------------------------------------------------

## 📁 Estrutura do Projeto

    📦 CampeonatoLaLiga
     ┣ 📂 src
     ┃ ┣ 📜 App.js
     ┃ ┣ 📜 firebase.js
     ┃ ┣ 📜 index.js
     ┣ 📜 package.json
     ┣ 📜 README.md
     ┗ 📜 tailwind.config.js

------------------------------------------------------------------------

## 💡 Créditos

Projeto criado por **João Vitor Mendonça**, com foco em simular uma liga
de futebol completa e interativa. ⚽

------------------------------------------------------------------------

## 📸 Prévia Visual

(Insira aqui um print do projeto ou link do CodeSandbox)
