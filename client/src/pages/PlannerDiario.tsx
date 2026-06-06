/* =============================================================
   PÁGINA: Planner Diário — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";
import { AddKawaiiButton, DeleteKawaiiButton } from "@/components/KawaiiListActions";

const GATINHOS_CAPA = "/assets/kawaii/kawaii_capa.png";

const horarios = ["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"];
const humores = [
  { emoji: "😊", label: "Ótimo" },
  { emoji: "🙂", label: "Bem" },
  { emoji: "😐", label: "Ok" },
  { emoji: "😔", label: "Cansado" },
  { emoji: "😤", label: "Estressado" },
];

export default function PlannerDiario() {
  const [, navigate] = useLocation();
  const [data, setData] = useLocalStorage('planner_plannerdiario_data', "");
  const [humorSelecionado, setHumorSelecionado] = useLocalStorage<number | null>('planner_plannerdiario_humorselecionado', null);
  const [agenda, setAgenda] = useLocalStorage<Record<string, string>>('planner_plannerdiario_agenda', Object.fromEntries(horarios.map(h => [h, ""])));
  const [tarefas, setTarefas] = useLocalStorage('planner_plannerdiario_tarefas', [{done:false,texto:""},{done:false,texto:""},{done:false,texto:""},{done:false,texto:""},{done:false,texto:""}]);
  const [prioridade1, setPrioridade1] = useLocalStorage('planner_plannerdiario_prioridade1', "");
  const [gratidao, setGratidao] = useLocalStorage('planner_plannerdiario_gratidao', ["","",""]);
  const [reflexao, setReflexao] = useLocalStorage('planner_plannerdiario_reflexao', "");
  const [agua, setAgua] = useLocalStorage('planner_plannerdiario_agua', [false,false,false,false,false,false,false,false]);
  const [notasDia, setNotasDia] = useLocalStorage('planner_plannerdiario_notasdia', "");
  const [afirmacao, setAfirmacao] = useLocalStorage('planner_plannerdiario_afirmacao', "");

  const addTarefa = () => setTarefas(prev => [...prev, { done: false, texto: "" }]);
  const removeTarefa = (index: number) => setTarefas(prev => prev.filter((_, i) => i !== index));
  const addGratidao = () => setGratidao(prev => [...prev, ""]);
  const removeGratidao = (index: number) => setGratidao(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      {/* Header */}
      <div style={{ background: "#F4B7C3", borderBottom: "3px solid #E8899A", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_CAPA} alt="Gatinhos estudando" style={{ width: 60, height: 60, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#7A2D3E" }}>☀️ Planner Diário</h1>
              <p style={{ color: "#9A4D5E", fontSize: "0.85rem", fontWeight: 600 }}>Comece o dia com intenção e termine com gratidão</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#7A2D3E", borderColor: "#7A2D3E" }} onClick={() => navigate("/")}>
            ← Índice
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Data e humor */}
        <div className="planner-card" style={{ padding: "1.25rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>📅 Data</div>
            <input
              value={data}
              onChange={e => setData(e.target.value)}
              placeholder="DD/MM/AAAA"
              style={{ border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }}
            />
          </div>
          <div>
            <div className="field-label" style={{ marginBottom: "0.5rem" }}>Como estou me sentindo hoje?</div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {humores.map((h, i) => (
                <button
                  key={i}
                  className={`mood-btn ${humorSelecionado === i ? "selected" : ""}`}
                  onClick={() => setHumorSelecionado(i)}
                  title={h.label}
                  style={{ fontSize: "1.3rem", width: "2.5rem", height: "2.5rem" }}
                >
                  {h.emoji}
                </button>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>✨ Afirmação do Dia</div>
            <input
              value={afirmacao}
              onChange={e => setAfirmacao(e.target.value)}
              placeholder="Eu sou capaz de..."
              style={{ width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }}
            />
          </div>
        </div>

        {/* Prioridade + Tarefas + Agenda */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "1.25rem" }}>
          {/* Prioridade e tarefas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="planner-card" style={{ padding: "1rem" }}>
              <div className="field-label" style={{ marginBottom: "0.4rem" }}>🔥 Minha Prioridade #1 Hoje</div>
              <input
                value={prioridade1}
                onChange={e => setPrioridade1(e.target.value)}
                placeholder="A coisa mais importante do dia..."
                style={{ width: "100%", border: "2px solid #F4B7C3", borderRadius: "0.75rem", padding: "0.6rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.95rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }}
              />
            </div>

            <div className="planner-card" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div className="field-label">✅ Tarefas do Dia</div>
                <AddKawaiiButton onClick={addTarefa} title="Incluir tarefa" />
              </div>
              {tarefas.map((t, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div
                    className={`habit-check ${t.done ? "checked" : ""}`}
                    onClick={() => setTarefas(prev => prev.map((tt, ii) => ii === i ? { ...tt, done: !tt.done } : tt))}
                  >
                    {t.done && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                  </div>
                  <input
                    value={t.texto}
                    onChange={e => setTarefas(prev => prev.map((tt, ii) => ii === i ? { ...tt, texto: e.target.value } : tt))}
                    placeholder={`Tarefa ${i+1}...`}
                    style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.85rem", color: t.done ? "#B0A090" : "#5B3A29", textDecoration: t.done ? "line-through" : "none", background:"transparent", outline:"none" }}
                  />
                  <DeleteKawaiiButton onClick={() => removeTarefa(i)} title="Excluir tarefa" />
                </div>
              ))}
            </div>

            {/* Hidratação */}
            <div className="planner-card" style={{ padding: "1rem" }}>
              <div className="field-label" style={{ marginBottom: "0.5rem" }}>💧 Hidratação (8 copos)</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {agua.map((a, i) => (
                  <button
                    key={i}
                    onClick={() => setAgua(prev => prev.map((aa, ii) => ii === i ? !aa : aa))}
                    style={{
                      width: 36, height: 36, borderRadius: "0.5rem",
                      border: "2px solid #B9DDE7",
                      background: a ? "#B9DDE7" : "#FFFBF3",
                      fontSize: "1.1rem", cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    💧
                  </button>
                ))}
              </div>
              <div style={{ marginTop: "0.4rem", fontSize: "0.75rem", color: "#8B6347", fontWeight: 600 }}>
                {agua.filter(Boolean).length}/8 copos
              </div>
            </div>
          </div>

          {/* Agenda horária */}
          <div className="planner-card" style={{ padding: "1rem" }}>
            <div className="field-label" style={{ marginBottom: "0.5rem" }}>🕐 Agenda do Dia</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              {horarios.map(h => (
                <div key={h} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#A96F45", minWidth: 40 }}>{h}</span>
                  <input
                    value={agenda[h]}
                    onChange={e => setAgenda(prev => ({ ...prev, [h]: e.target.value }))}
                    placeholder="..."
                    style={{ flex:1, border:"none", borderBottom:"1px dotted #E8D5C0", padding:"0.25rem 0.2rem", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.8rem", color:"#5B3A29", background:"transparent", outline:"none" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gratidão e reflexão */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div className="planner-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 4, height: 22, background: "#F4B7C3", borderRadius: 4 }} />
                <h2 className="section-title" style={{ fontSize: "1rem" }}>🌸 Gratidão do Dia</h2>
              </div>
              <AddKawaiiButton onClick={addGratidao} title="Incluir gratidão" />
            </div>
            {gratidao.map((g, i) => (
              <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "#F4B7C3", fontSize: "0.9rem" }}>♡</span>
                <input
                  value={g}
                  onChange={e => { const n=[...gratidao]; n[i]=e.target.value; setGratidao(n); }}
                  placeholder={`Sou grata(o) por...`}
                  style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.35rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.85rem", color:"#5B3A29", background:"transparent", outline:"none" }}
                />
                <DeleteKawaiiButton onClick={() => removeGratidao(i)} title="Excluir gratidão" />
              </div>
            ))}
          </div>

          <div className="planner-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ width: 4, height: 22, background: "#BFD8B8", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1rem" }}>🌙 Reflexão do Dia</h2>
            </div>
            <textarea
              value={reflexao}
              onChange={e => setReflexao(e.target.value)}
              placeholder="Como foi o dia? O que aprendi? O que posso melhorar amanhã?"
              rows={5}
              style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.6rem 0.9rem", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.85rem", color:"#5B3A29", background:"#FFFBF3", outline:"none", resize:"vertical" }}
            />
          </div>
        </div>

        {/* Notas livres */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div className="field-label" style={{ marginBottom: "0.5rem" }}>📝 Notas & Lembretes</div>
          <textarea
            value={notasDia}
            onChange={e => setNotasDia(e.target.value)}
            placeholder="Anote aqui qualquer coisa importante do dia..."
            rows={3}
            style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.6rem 0.9rem", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.85rem", color:"#5B3A29", background:"#FFFBF3", outline:"none", resize:"vertical" }}
          />
        </div>

        {/* Navegação */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/planner-semanal")}>
            ← Planner Semanal
          </button>
          <button className="nav-btn" onClick={() => navigate("/metas-objetivos")}>
            Metas & Objetivos →
          </button>
        </div>
      </div>
    </div>
  );
}
