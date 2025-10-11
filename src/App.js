import React, { useState } from "react";
import "./App.css";

const TEAMS = [
  { nome: "João Vitor" },
  { nome: "Diney" },
  { nome: "Pastor" },
  { nome: "Roni" },
  { nome: "Heliton" },
  { nome: "Fulão" },
];

function criaTabelaInicial() {
  return TEAMS.map((t) => ({
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

function geraRodadas(times) {
  const n = times.length;
  const totalRodadas = (n - 1) * 2;
  const meio = Math.floor(n / 2);
  const rodadas = [];
  let lista = [...times];
  for (let rodada = 0; rodada < totalRodadas; rodada++) {
    const jogos = [];
    for (let i = 0; i < meio; i++) {
      const mandante = lista[i].nome;
      const visitante = lista[n - 1 - i].nome;
      jogos.push({
        id: `${rodada}-${i}-1`,
        mandante,
        visitante,
        golM: "",
        golV: "",
        jogado: false,
      });
    }
    rodadas.push(jogos);
    lista = [lista[0], lista[n - 1], ...lista.slice(1, n - 1)];
  }
  return rodadas;
}

function ordenarTabela(tabela) {
  return [...tabela].sort((a, b) => {
    if (b.Pontos !== a.Pontos) return b.Pontos - a.Pontos;
    if (b.SG !== a.SG) return b.SG - a.SG;
    if (b.GP !== a.GP) return b.GP - a.GP;
    return a.nome.localeCompare(b.nome);
  });
}

function atualizarEstatisticas(tabela, mandante, visitante, gm, gv) {
  const novo = tabela.map((row) => ({ ...row }));
  const findIndex = (name) => novo.findIndex((r) => r.nome === name);
  const iM = findIndex(mandante);
  const iV = findIndex(visitante);
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

function desfazerEstatisticas(tabela, mandante, visitante, gm, gv) {
  const novo = tabela.map((row) => ({ ...row }));
  const findIndex = (name) => novo.findIndex((r) => r.nome === name);
  const iM = findIndex(mandante);
  const iV = findIndex(visitante);
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

function calcularAgregado(rodadas, mandante, visitante) {
  let gm = 0,
    gv = 0;
  rodadas.forEach((rod) => {
    rod.forEach((j) => {
      if (
        (j.mandante === mandante && j.visitante === visitante) ||
        (j.mandante === visitante && j.visitante === mandante)
      ) {
        gm += parseInt(j.golM || 0);
        gv += parseInt(j.golV || 0);
      }
    });
  });
  return `${gm} x ${gv}`;
}

export default function App() {
  const [tabela, setTabela] = useState(criaTabelaInicial());
  const [rodadas, setRodadas] = useState(geraRodadas(TEAMS));

  const handleChangePlacar = (rodadaIdx, jogoIdx, campo, value) => {
    const nova = rodadas.map((r, ri) =>
      r.map((j, ji) =>
        ri === rodadaIdx && ji === jogoIdx ? { ...j, [campo]: value } : j
      )
    );
    setRodadas(nova);
  };

  const registrar = (rodadaIdx, jogoIdx) => {
    const jogo = rodadas[rodadaIdx][jogoIdx];
    if (jogo.jogado) return;
    const gm = parseInt(jogo.golM || 0);
    const gv = parseInt(jogo.golV || 0);
    setTabela((prev) =>
      atualizarEstatisticas(prev, jogo.mandante, jogo.visitante, gm, gv)
    );
    const nova = rodadas.map((r, ri) =>
      r.map((j, ji) =>
        ri === rodadaIdx && ji === jogoIdx ? { ...j, jogado: true } : j
      )
    );
    setRodadas(nova);
  };

  const desfazer = (rodadaIdx, jogoIdx) => {
    const jogo = rodadas[rodadaIdx][jogoIdx];
    if (!jogo.jogado) return;
    const gm = parseInt(jogo.golM || 0);
    const gv = parseInt(jogo.golV || 0);
    setTabela((prev) =>
      desfazerEstatisticas(prev, jogo.mandante, jogo.visitante, gm, gv)
    );
    const nova = rodadas.map((r, ri) =>
      r.map((j, ji) =>
        ri === rodadaIdx && ji === jogoIdx
          ? { ...j, jogado: false, golM: "", golV: "" }
          : j
      )
    );
    setRodadas(nova);
  };

  const resetarTudo = () => {
    setTabela(criaTabelaInicial());
    setRodadas(geraRodadas(TEAMS));
  };

  const tabelaOrdenada = ordenarTabela(tabela);
  const campeao = tabelaOrdenada[0].nome;

  return (
    <div className="app">
      <header className="cabecalho">
        <h1>🏆 Torneio LaLiga</h1>
        <p className="sub">Pontos corridos · Ida e Volta · Tema clássico</p>
      </header>

      <main className="container">
        {/* Tabela de classificação */}
        <section className="tabelaCard">
          <div className="cardHeader">
            <h2>Tabela de Classificação</h2>
            <button className="btn small" onClick={resetarTudo}>
              🔁 Resetar campeonato
            </button>
          </div>
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
                  <td className="time">{t.nome}</td>
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

        {/* Rodadas estilo Champions League */}
        <section className="jogosCard rodadasContainer">
          {rodadas.map((rodada, rIdx) => (
            <div key={rIdx}>
              <h2 style={{ color: "#c8102e" }}>🏟️ Rodada {rIdx + 1}</h2>
              <div className="chavesContainer">
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
                        disabled={jogo.jogado}
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
                        disabled={jogo.jogado}
                      />
                      <div className="timeNome">{jogo.visitante}</div>
                    </div>
                    <div className="agregadoConfronto">
                      <strong>
                        Agregado:{" "}
                        {calcularAgregado(
                          rodadas,
                          jogo.mandante,
                          jogo.visitante
                        )}
                      </strong>
                    </div>
                    <div className="botoesConfronto">
                      <button
                        className="btn"
                        onClick={() => registrar(rIdx, jIdx)}
                        disabled={jogo.jogado}
                      >
                        Registrar
                      </button>
                      {jogo.jogado && (
                        <button
                          className="btn danger"
                          onClick={() => desfazer(rIdx, jIdx)}
                        >
                          Desfazer
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
