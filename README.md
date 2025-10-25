# 🏆 Campeonato La Liga — Pontos Corridos

Projeto desenvolvido em **React + Firebase** que simula um campeonato de futebol com sistema de **pontos corridos**, jogos de **ida e volta** e **tabela atualizada automaticamente** em tempo real.

---

## ⚙️ Tecnologias utilizadas

- ⚛️ **React.js** — Framework para construção da interface  
- 🔥 **Firebase Realtime Database** — Para salvar e sincronizar os dados dos jogos e pontuação  
- 💅 **CSS Clássico (modo claro)** — Visual limpo e tradicional para fácil leitura  
- 🌐 **CodeSandbox / GitHub Pages** — Para hospedagem do projeto online  

---

## 🚀 Como executar o projeto localmente

1️⃣ Clone o repositório:
```bash
git clone https://github.com/SEU_USUARIO/CampeonatoLaLiga.git
2️⃣ Instale as dependências:

bash
Copiar código
npm install
3️⃣ Configure o Firebase:

Crie um projeto no Firebase Console

Ative o Realtime Database

Copie as credenciais e cole no arquivo src/firebase.js conforme o exemplo:

javascript
Copiar código
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  databaseURL: "https://SEU_PROJETO.firebaseio.com",
  projectId: "SEU_ID_PROJETO",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
4️⃣ Execute o projeto:

bash
Copiar código
npm start
5️⃣ Abra no navegador:

arduino
Copiar código
http://localhost:3000
👥 Participantes do campeonato
João

Diney

Pastor

Heliton

Davi

Fulão

Roni

Sistema de ida e volta entre todos os participantes.

🧮 Regras da tabela
✅ Vitória: 3 pontos

⚖️ Empate: 1 ponto

❌ Derrota: 0 pontos

🏅 Critérios de desempate:

Saldo de gols

Gols marcados

Confronto direto

💾 Funcionalidades
Inserção de gols por partida

Cálculo automático da classificação

Persistência no Firebase (dados salvos para todos os usuários)

Atualização em tempo real da tabela

Layout limpo e modo clássico

🌍 Link público do projeto
🔗 Acesse o site: https://lklm7f-3000.csb.app/

(substitua pelo link do CodeSandbox ou hospedagem do Firebase Hosting quando disponível)

🧑‍💻 Desenvolvido por
João Vitor Mendonça
🔗 LinkedIn
💻 GitHub

🧱 Licença
Este projeto é de uso livre para fins educacionais e demonstrações.
Créditos obrigatórios ao autor em caso de reprodução pública.

yaml
Copiar código

---







