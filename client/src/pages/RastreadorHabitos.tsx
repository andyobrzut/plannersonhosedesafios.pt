/* =============================================================
   PÁGINA: Rastreador de Hábitos — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";
import { DeleteKawaiiButton } from "@/components/KawaiiListActions";

const GATINHOS_HABITOS = "/assets/kawaii/kawaii_habitos.png";

const dias31 = Array.from({ length: 31 }, (_, i) => i + 1);

const habitosPadrao = [
  { nome: "💧 Beber 2L de água", cor: "#B9DDE7" },
  { nome: "🏃 Exercício físico", cor: "#BFD8B8" },
  { nome: "📚 Estudar", cor: "#F7D98B" },
  { nome: "😴 Dormir 8 horas", cor: "#F4B7C3" },
  { nome: "🥗 Comer saudável", cor: "#BFD8B8" },
  { nome: "📵 Sem redes sociais", cor: "#B9DDE7" },
];

export default function RastreadorHabitos() {
  const [, navigate] = useLocation();
  const [mes, setMes] = useLocalStorage('planner_rastreadorhabitos_mes', "Junho 2025");
  const [habitos, setHabitos] = useLocalStorage('planner_rastreadorhabitos_habitos', habitosPadrao.map(h => ({ ...h, dias: {} as Record<number, boolean> })));
  const [novoHabito, setNovoHabito] = useLocalStorage('planner_rastreadorhabitos_novohabito', "");

  const toggle = (hi: number, dia: number) => {
    setHabitos(prev => prev.map((h, i) => i === hi ? { ...h, dias: { ...h.dias, [dia]: !h.dias[dia] } } : h));
  };

  const addHabito = () => {
    if (novoHabito.trim()) {
      const cores = ["#F7D98B","#F4B7C3","#B9DDE7","#BFD8B8"];
      setHabitos(prev => [...prev, { nome: novoHabito.trim(), cor: cores[prev.length % cores.length], dias: {} }]);
      setNovoHabito("");
    }
  };

  const getStreak = (h: typeof habitos[0]) => {
    let streak = 0;
    for (let d = 31; d >= 1; d--) {
      if (h.dias[d]) streak++;
      else break;
    }
    return streak;
  };

  const getTotal = (h: typeof habitos[0]) => Object.values(h.dias).filter(Boolean).length;

  const deleteHabito = (i: number) => {
    setHabitos(prev => prev.filter((_, ii) => ii !== i));
  };

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      <div style={{ background: "#BFD8B8", borderBottom: "3px solid #7BA87A", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_HABITOS} alt="Gatinhos hábitos" style={{ width: 60, height: 60, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#3D5C3A" }}>✅ Rastreador de Hábitos</h1>
              <p style={{ color: "#5A7A58", fontSize: "0.85rem", fontWeight: 600 }}>Construa rotinas consistentes, um dia de cada vez</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#3D5C3A", borderColor: "#3D5C3A" }} onClick={() => navigate("/")}>← Índice</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Cabeçalho e adicionar hábito */}
        <div className="planner-card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>📅 Mês</div>
            <input
              value={mes}
              onChange={e => setMes(e.target.value)}
              style={{ border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 220, display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <div className="field-label" style={{ marginBottom: "0.3rem" }}>➕ Adicionar Hábito</div>
              <input
                value={novoHabito}
                onChange={e => setNovoHabito(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addHabito()}
                placeholder="Ex: 🧘 Meditação..."
                style={{ width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }}
              />
            </div>
            <button className="nav-btn" onClick={addHabito} style={{ whiteSpace: "nowrap" }}>Adicionar</button>
          </div>
        </div>

        {/* Grade de hábitos */}
        <div className="planner-card" style={{ padding: "1.25rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", minWidth: 700 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.8rem", color: "#5B3A29", paddingBottom: "0.5rem", minWidth: 180, paddingRight: "0.75rem" }}>
                  Hábito
                </th>
                {dias31.map(d => (
                  <th key={d} style={{ textAlign: "center", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#8B6347", paddingBottom: "0.5rem", minWidth: 22 }}>
                    {d}
                  </th>
                ))}
                <th style={{ textAlign: "center", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#8B6347", paddingBottom: "0.5rem", paddingLeft: "0.5rem" }}>Total</th>
                <th style={{ textAlign: "center", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#8B6347", paddingBottom: "0.5rem" }}>Sequência</th>
              </tr>
            </thead>
            <tbody>
              {habitos.map((h, hi) => (
                <tr key={hi}>
                  <td style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#5B3A29", paddingRight: "0.75rem", paddingTop: "2px", paddingBottom: "2px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: h.cor, flexShrink: 0 }} />
                      {h.nome}
                    </div>
                  </td>
                  {dias31.map(d => (
                    <td key={d} style={{ textAlign: "center", padding: "2px 1px" }}>
                      <div
                        onClick={() => toggle(hi, d)}
                        style={{
                          width: 20, height: 20, borderRadius: 4,
                          border: `2px solid ${h.cor}`,
                          background: h.dias[d] ? h.cor : "#FFFBF3",
                          cursor: "pointer", margin: "0 auto",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.6rem", color: "#5B3A29",
                          transition: "all 0.12s ease",
                        }}
                      >
                        {h.dias[d] ? "✓" : ""}
                      </div>
                    </td>
                  ))}
                  <td style={{ textAlign: "center", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#A96F45", paddingLeft: "0.5rem" }}>
                    {getTotal(h)}
                  </td>
                  <td style={{ textAlign: "center", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.85rem", color: "#7BA87A" }}>
                    {getStreak(h) > 0 ? `🔥 ${getStreak(h)}` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dica */}
        <div style={{ background: "linear-gradient(135deg, #F5EDE0, #FFF0D8)", borderRadius: "1.25rem", border: "2px solid #E8D5C0", padding: "1rem 1.5rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <span style={{ fontSize: "1.8rem" }}>🐱</span>
          <div>
            <p style={{ fontWeight: 800, color: "#5B3A29", fontSize: "0.88rem", marginBottom: "0.1rem" }}>Recado do Gatinho</p>
            <p style={{ color: "#8B6347", fontSize: "0.8rem", fontWeight: 500 }}>Comece com apenas 2-3 hábitos. Consistência é mais importante que quantidade. Um pequeno passo por dia já ilumina o caminho! 🌿</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/metas-objetivos")}>← Metas</button>
          <button className="nav-btn" onClick={() => navigate("/financeiro")}>Controle Financeiro →</button>
        </div>
      </div>
    </div>
  );
}
