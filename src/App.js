import React, { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";
import { ref, set, onValue } from "firebase/database";

const TEAMS = [
  { nome: "João Vitor" },
  { nome: "Diney" },
  { nome: "Pastor" },
  { nome: "Roni" },
  { nome: "Heliton" },
  { nome: "Fulão" },
  { nome: "Davi" },
];

function gerarRodadas(times) {
  const numTimes = times.length;
  const rodadas = [];
  let lista = [...times];
  if (numTimes % 2 !== 0) lista.push({ nome: "Folga" });

  const totalRodadas = lista.length - 1;
  const metade = lista.length / 2;

  for (let r = 0; r < totalRodadas; r++) {
    const jogos = [];
    for (let i = 0; i < metade; i++) {
      const mandante = lista[i];
      const visitante = lista[lista.length - 1 - i];
      if (mandante.nome !== "Folga" && visitante.nome !== "Folga") {
        jogos.push({
          id: `${r}-${i}`,
          mandante: mandante.nome,
          visitante: visitante.nome,
          golM: "",
          golV: "",
          registrado: false,
        });
      }
    }
    rodadas.push(jogos);
    lista.splice(1, 0, lista.pop());
  }

  const rodadasVolta = rodadas.map((r) =>
    r.map((j) => ({
      ...j,
      id: `v-${j.id}`,
      mandante: j.visitante,
      visitante: j.mandante,
      golM: "",
      golV: "",
      registrado: false,
    }))
  );

  return [...rodadas, ...rodadasVolta];
}

function inicializarTabela(times) {
  return times.map((t) => ({
    nome: t.nome,
    P: 0,
    V: 0,
    E: 0,
    D: 0,
    GP: 0,
    GC: 0,
    SG: 0,
    Pontos: 0,
  }));
}

export default function App() {
  const [rodadas, setRodadas] = useState([]);
  const [tabela, setTabela] = useState([]);

  useEffect(() => {
    const rodadasRef = ref(db, "rodadas");
    const tabelaRef = ref(db, "tabela");

    onValue(rodadasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setRodadas(data);
      else {
        const novasRodadas = gerarRodadas(TEAMS);
        setRodadas(novasRodadas);
        set(rodadasRef, novasRodadas);
      }
    });

    onValue(tabelaRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setTabela(data);
      else {
        const novaTabela = inicializarTabela(TEAMS);
        set(tabelaRef, novaTabela);
        setTabela(novaTabela);
      }
    });
  }, []);

  function handleChangePlacar(rIdx, jIdx, campo, valor) {
    const novasRodadas = [...rodadas];
    novasRodadas[rIdx][jIdx][campo] = valor;
    setRodadas(novasRodadas);
    set(ref(db, "rodadas"), novasRodadas);
  }

  function atualizarTabela(mandante, visitante, golM, golV) {
    const novaTabela = [...tabela];
    const timeM = novaTabela.find((t) => t.nome === mandante);
    const timeV = novaTabela.find((t) => t.nome === visitante);
    golM = parseInt(golM);
    golV = parseInt(golV);

    timeM.GP += golM;
    timeM.GC += golV;
    timeV.GP += golV;
    timeV.GC += golM;
    timeM.SG = timeM.GP - timeM.GC;
    timeV.SG = timeV.GP - timeV.GC;

    if (golM > golV) {
      timeM.V++;
      timeV.D++;
      timeM.Pontos += 3;
    } else if (golM < golV) {
      timeV.V++;
      timeM.D++;
      timeV.Pontos += 3;
    } else {
      timeM.E++;
      timeV.E++;
      timeM.Pontos++;
      timeV.Pontos++;
    }

    setTabela(novaTabela);
    set(ref(db, "tabela"), novaTabela);
  }

  function registrar(rIdx, jIdx) {
    const jogo = rodadas[rIdx][jIdx];
    if (jogo.registrado || jogo.golM === "" || jogo.golV === "") return;

    atualizarTabela(jogo.mandante, jogo.visitante, jogo.golM, jogo.golV);

    const novasRodadas = [...rodadas];
    novasRodadas[rIdx][jIdx].registrado = true;
    setRodadas(novasRodadas);
    set(ref(db, "rodadas"), novasRodadas);
  }

  function desfazer(rIdx, jIdx) {
    const jogo = rodadas[rIdx][jIdx];
    if (!jogo.registrado) return;

    const novaTabela = [...tabela];
    const timeM = novaTabela.find((t) => t.nome === jogo.mandante);
    const timeV = novaTabela.find((t) => t.nome === jogo.visitante);
    const golM = parseInt(jogo.golM);
    const golV = parseInt(jogo.golV);

    timeM.GP -= golM;
    timeM.GC -= golV;
    timeV.GP -= golV;
    timeV.GC -= golM;
    timeM.SG = timeM.GP - timeM.GC;
    timeV.SG = timeV.GP - timeV.GC;

    if (golM > golV) {
      timeM.V--;
      timeV.D--;
      timeM.Pontos -= 3;
    } else if (golM < golV) {
      timeV.V--;
      timeM.D--;
      timeV.Pontos -= 3;
    } else {
      timeM.E--;
      timeV.E--;
      timeM.Pontos--;
    }

    const novasRodadas = [...rodadas];
    novasRodadas[rIdx][jIdx].registrado = false;
    novasRodadas[rIdx][jIdx].golM = "";
    novasRodadas[rIdx][jIdx].golV = "";
    setRodadas(novasRodadas);
    setTabela(novaTabela);
    set(ref(db, "rodadas"), novasRodadas);
    set(ref(db, "tabela"), novaTabela);
  }

  function resetarTudo() {
    if (!window.confirm("Deseja realmente reiniciar o campeonato?")) return;
    const novasRodadas = gerarRodadas(TEAMS);
    const novaTabela = inicializarTabela(TEAMS);
    setRodadas(novasRodadas);
    setTabela(novaTabela);
    set(ref(db, "rodadas"), novasRodadas);
    set(ref(db, "tabela"), novaTabela);
  }

  function ordenarTabela(tabela) {
    return [...tabela].sort((a, b) => {
      if (b.Pontos !== a.Pontos) return b.Pontos - a.Pontos;
      if (b.SG !== a.SG) return b.SG - a.SG;
      if (b.GP !== a.GP) return b.GP - a.GP;
      return a.nome.localeCompare(b.nome);
    });
  }

  const tabelaOrdenada = ordenarTabela(tabela);
  const campeao = tabelaOrdenada[0]?.nome || "";

  return (
    <div className="App">
      <header className="cabecalho">
        <h1>🏆 Torneio LaLiga</h1>
        <p className="sub">
          Pontos corridos · Ida e Volta · Todos veem em tempo real
        </p>
      </header>
      {/* Aqui continuaria o JSX da tabela e rodadas igual você já tinha */}
    </div>
  );
}
