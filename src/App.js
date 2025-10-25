// src/App.js
import React, { useEffect, useState } from "react";
import "./App.css";
import { db } from "./firebase";
import { ref, onValue, set } from "firebase/database";

/*
  Participantes (conforme você pediu)
*/
const TEAMS = [
  { nome: "João" },
  { nome: "Diney" },
  { nome: "Pastor" },
  { nome: "Heliton" },
  { nome: "Davi" },
  { nome: "Fulão" },
  { nome: "Roni" },
];

/* Gera rodadas (round-robin) com ida e volta e trata folga se número ímpar */
function gerarRodadas(times) {
  const timesCopy = [...times];
  if (timesCopy.length % 2 !== 0) timesCopy.push({ nome: "Folga" });

  const n = timesCopy.length;
  const totalRodadas = n - 1;
  const meio = n / 2;
  const rodadas = [];
  let lista = [...timesCopy];

  for (let r = 0; r < totalRodadas; r++) {
    const jogos = [];
    for (let i = 0; i < meio; i++) {
      const a = lista[i];
      const b = lista[n - 1 - i];
      if (a.nome !== "Folga" && b.nome !== "Folga") {
        jogos.push({
          id: `${r}-${i}`,
          mandante: a.nome,
          visitante: b.nome,
          golM: "",
          golV: "",
          registrado: false,
        });
      }
    }
    rodadas.push(jogos);
    // rotaciona (fixa o primeiro)
    lista = [lista[0], lista[n - 1], ...lista.slice(1, n - 1)];
  }

  // volta (inverte mandante/visitante)
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

/* util: ordenar tabela */
function ordenarTabela(tabela) {
  return [...tabela].sort((a, b) => {
    if (b.Pontos !== a.Pontos) return b.Pontos - a.Pontos;
    if (b.SG !== a.SG) return b.SG - a.SG;
    if (b.GP !== a.GP) return b.GP - a.GP;
    return a.nome.localeCompare(b.nome);
  });
}

/* atualiza estatísticas da tabela */
function aplicarResultado(tabela, mandante, visitante, gm, gv) {
  const novo = tabela.map((row) => ({ ...row }));
  const iM = novo.findIndex((r) => r.nome === mandante);
  const iV = novo.findIndex((r) => r.nome === visitante);
  if (iM === -1 || iV === -1) return novo;

  novo[iM].P += 1;
  novo[iV].P += 1;
  novo[iM].GP += gm;
  novo[iM].GC += gv;
  novo[iV].GP += gv;
  novo[iV].GC += gm;
  novo[iM].SG = novo[iM].GP - novo[iM].GC;
  novo[iV].SG = novo[iV].GP - novo[iV].GC;

  if (gm > gv) {
    novo[iM].V += 1;
    novo[iV].D += 1;
    novo[iM].Pontos += 3;
  } else if (gm < gv) {
    novo[iV].V += 1;
    novo[iM].D += 1;
    novo[iV].Pontos += 3;
  } else {
    novo[iM].E += 1;
    novo[iV].E += 1;
    novo[iM].Pontos += 1;
    novo[iV].Pontos += 1;
  }
  return novo;
}

/* desfaz resultado */
function desfazerResultado(tabela, mandante, visitante, gm, gv) {
  const novo = tabela.map((row) => ({ ...row }));
  const iM = novo.findIndex((r) => r.nome === mandante);
  const iV = novo.findIndex((r) => r.nome === visitante);
  if (iM === -1 || iV === -1) return novo;

  novo[iM].P -= 1;
  novo[iV].P -= 1;
  novo[iM].GP -= gm;
  novo[iM].GC -= gv;
  novo[iV].GP -= gv;
  novo[iV].GC -= gm;
  novo[iM].SG = novo[iM].GP - novo[iM].GC;
  novo[iV].SG = novo[iV].GP - novo[iV].GC;

  if (gm > gv) {
    novo[iM].V -= 1;
    novo[iV].D -= 1;
    novo[iM].Pontos -= 3;
  } else if (gm < gv) {
    novo[iV].V -= 1;
    novo[iM].D -= 1;
    novo[iV].Pontos -= 3;
  } else {
    novo[iM].E -= 1;
    novo[iV].E -= 1;
    novo[iM].Pontos -= 1;
    novo[iV].Pontos -= 1;
  }
  return novo;
}

/* calcula agregado (somatório de gols já registrados nos rodadas) */
function calcularAgregado(rodadas, a, b) {
  let gm = 0,
    gv = 0;
  rodadas.forEach((rod) => {
    rod.forEach((j) => {
      if (
        (j.mandante === a && j.visitante === b) ||
        (j.mandante === b && j.visitante === a)
      ) {
        gm += parseInt(j.golM || 0, 10);
        gv += parseInt(j.golV || 0, 10);
      }
    });
  });
  return `${gm} x ${gv}`;
}

export default function App() {
  const [rodadas, setRodadas] = useState([]);
  const [tabela, setTabela] = useState([]);

  /* referências no Realtime DB */
  const rodadasRefPath = "torneio/rodadas_v1";
  const tabelaRefPath = "torneio/tabela_v1";

  /* carrega rodadas e tabela do Firebase ou inicializa se vazio */
  useEffect(() => {
    // ouvinte para rodadas
    const rRef = ref(db, rodadasRefPath);
    onValue(rRef, (snap) => {
      const data = snap.val();
      if (data) {
        setRodadas(data);
      } else {
        const inicRodadas = gerarRodadas(TEAMS);
        set(ref(db, rodadasRefPath), inicRodadas);
        setRodadas(inicRodadas);
      }
    });

    // ouvinte para tabela
    const tRef = ref(db, tabelaRefPath);
    onValue(tRef, (snap) => {
      const data = snap.val();
      if (data) {
        setTabela(data);
      } else {
        const inicTabela = inicializarTabela(TEAMS);
        set(ref(db, tabelaRefPath), inicTabela);
        setTabela(inicTabela);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* altera placar local e no Firebase (não registra ainda) */
  const handleChangePlacar = (rIdx, jIdx, campo, value) => {
    const novas = rodadas.map((r, ri) =>
      r.map((j, ji) =>
        ri === rIdx && ji === jIdx ? { ...j, [campo]: value } : j
      )
    );
    setRodadas(novas);
    set(ref(db, rodadasRefPath), novas);
  };

  /* registrar resultado: atualiza tabela e marca jogo registrado */
  const registrar = (rIdx, jIdx) => {
    const jogo = rodadas[rIdx][jIdx];
    if (!jogo || jogo.registrado) return;
    if (jogo.golM === "" || jogo.golV === "") return;

    const gm = parseInt(jogo.golM, 10);
    const gv = parseInt(jogo.golV, 10);

    // aplica resultado na tabela atual
    const novaTabela = aplicarResultado(
      tabela,
      jogo.mandante,
      jogo.visitante,
      gm,
      gv
    );
    setTabela(novaTabela);
    set(ref(db, tabelaRefPath), novaTabela);

    // marca o jogo como registrado
    const novasRodadas = rodadas.map((r, ri) =>
      r.map((j, ji) =>
        ri === rIdx && ji === jIdx ? { ...j, registrado: true } : j
      )
    );
    setRodadas(novasRodadas);
    set(ref(db, rodadasRefPath), novasRodadas);
  };

  /* desfazer resultado: reverte tabela e desmarca jogo */
  const desfazer = (rIdx, jIdx) => {
    const jogo = rodadas[rIdx][jIdx];
    if (!jogo || !jogo.registrado) return;
    const gm = parseInt(jogo.golM || 0, 10);
    const gv = parseInt(jogo.golV || 0, 10);

    const novaTabela = desfazerResultado(
      tabela,
      jogo.mandante,
      jogo.visitante,
      gm,
      gv
    );
    setTabela(novaTabela);
    set(ref(db, tabelaRefPath), novaTabela);

    const novasRodadas = rodadas.map((r, ri) =>
      r.map((j, ji) =>
        ri === rIdx && ji === jIdx
          ? { ...j, registrado: false, golM: "", golV: "" }
          : j
      )
    );
    setRodadas(novasRodadas);
    set(ref(db, rodadasRefPath), novasRodadas);
  };

  const resetarTudo = () => {
    if (!window.confirm("Reiniciar campeonato? Isso apagará resultados."))
      return;
    const novasRodadas = gerarRodadas(TEAMS);
    const novaTabela = inicializarTabela(TEAMS);
    setRodadas(novasRodadas);
    setTabela(novaTabela);
    set(ref(db, rodadasRefPath), novasRodadas);
    set(ref(db, tabelaRefPath), novaTabela);
  };

  const tabelaOrdenada = ordenarTabela(tabela);
  const campeao = tabelaOrdenada[0]?.nome || "";

  return (
    <div className="app">
      <header className="cabecalho">
        <h1>🏆 Torneio LaLiga</h1>
        <p className="sub">Pontos corridos · Ida e Volta · Todos veem</p>
      </header>

      <main className="container">
        {/* Tabela */}
        <section className="tabelaCard">
          <h2>Tabela de Classificação</h2>
          <table className="tabela">
            <thead>
              <tr>
                <th>#</th>
                <th>Time</th>
                <th>P</th>
                <th>V</th>
                <th>E</th>
                <th>D</th>
                <th>GP</th>
                <th>GC</th>
                <th>SG</th>
                <th>Pontos</th>
              </tr>
            </thead>
            <tbody>
              {tabelaOrdenada.map((t, idx) => (
                <tr
                  key={t.nome}
                  className={t.nome === campeao ? "destaque" : ""}
                >
                  <td>{idx + 1}</td>
                  <td className="timeNome">{t.nome}</td>
                  <td>{t.P}</td>
                  <td>{t.V}</td>
                  <td>{t.E}</td>
                  <td>{t.D}</td>
                  <td>{t.GP}</td>
                  <td>{t.GC}</td>
                  <td>{t.SG}</td>
                  <td className="pontos">{t.Pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Rodadas (vertical) */}
        <section className="jogosArea">
          {rodadas.map((rodada, rIdx) => (
            <div key={rIdx} className="rodadaBlock">
              <h2 className="rodadaTitle">🏟️ Rodada {rIdx + 1}</h2>
              {rodada.map((jogo, jIdx) => (
                <div className="blocoConfronto" key={jogo.id}>
                  <div className="jogo">
                    <div className="timeNome">{jogo.mandante}</div>
                    <input
                      type="number"
                      min="0"
                      className="inputGol"
                      value={jogo.golM}
                      onChange={(e) =>
                        handleChangePlacar(rIdx, jIdx, "golM", e.target.value)
                      }
                      disabled={jogo.registrado}
                    />
                    <span className="x">x</span>
                    <input
                      type="number"
                      min="0"
                      className="inputGol"
                      value={jogo.golV}
                      onChange={(e) =>
                        handleChangePlacar(rIdx, jIdx, "golV", e.target.value)
                      }
                      disabled={jogo.registrado}
                    />
                    <div className="timeNome">{jogo.visitante}</div>
                  </div>
                  <div className="agregadoConfronto">
                    Agregado:{" "}
                    {calcularAgregado(rodadas, jogo.mandante, jogo.visitante)}
                  </div>
                  <div className="botoesConfronto">
                    <button
                      className="btn"
                      onClick={() => registrar(rIdx, jIdx)}
                      disabled={jogo.registrado}
                    >
                      Registrar
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => desfazer(rIdx, jIdx)}
                      disabled={!jogo.registrado}
                    >
                      Desfazer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </section>

        <footer className="rodape">
          <button className="btn danger big" onClick={resetarTudo}>
            🔄 Reiniciar Campeonato
          </button>
          <div className="smallNote">
            Dados salvos no Firebase Realtime Database.
          </div>
        </footer>
      </main>
    </div>
  );
}
