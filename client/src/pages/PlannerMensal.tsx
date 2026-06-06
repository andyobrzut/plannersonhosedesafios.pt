/* =============================================================
   PÁGINA: Planner Mensal — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";

const GATINHOS_CALENDARIO = "/assets/kawaii/kawaii_calendario.png";

const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const diasSemana = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

interface Prova {
  data: string;
  materia: string;
}

interface Tarefa {
  done: boolean;
  texto: string;
}

export default function PlannerMensal() {
  const [, navigate] = useLocation();
  const hoje = new Date();
  
  // Todos os estados usam localStorage para persistência automática
  const [mesAtual, setMesAtual] = useLocalStorage('planner_mensal_mes', hoje.getMonth());
  const [anoAtual, setAnoAtual] = useLocalStorage('planner_mensal_ano', hoje.getFullYear());
  const [notas, setNotas] = useLocalStorage<Record<number, string>>('planner_mensal_notas', {});
  const [metasMes, setMetasMes] = useLocalStorage<string[]>('planner_mensal_metas', ["","","",""]);
  const [prioridades, setPrioridades] = useLocalStorage<string[]>('planner_mensal_prioridades', ["","",""]);
  const [focoDomes, setFocoDomes] = useLocalStorage('planner_mensal_foco', "");
  const [reflexao, setReflexao] = useLocalStorage('planner_mensal_reflexao', "");
  const [provas, setProvas] = useLocalStorage<Prova[]>('planner_mensal_provas', [{data:"",materia:""},{data:"",materia:""}]);
  const [tarefas, setTarefas] = useLocalStorage<Tarefa[]>('planner_mensal_tarefas', [{done:false,texto:""},{done:false,texto:""}]);

  const primeiroDia = new Date(anoAtual, mesAtual, 1).getDay();
  const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < primeiroDia; i++) cells.push(null);
  for (let d = 1; d <= diasNoMes; d++) cells.push(d);

  const mudarMes = (dir: number) => {
    let m = mesAtual + dir;
    let a = anoAtual;
    if (m < 0) { m = 11; a--; }
    if (m > 11) { m = 0; a++; }
    setMesAtual(m);
    setAnoAtual(a);
  };

  // Funções CRUD
  const addItem = (setter: any) => setter((prev: any[]) => [...prev, typeof prev[0] === 'string' ? "" : (Array.isArray(prev[0]) ? [] : (typeof prev[0] === 'object' ? { ...prev[0], done: false, texto: "", data: "", materia: "" } : ""))]);
  
  const addMeta = () => setMetasMes(prev => [...prev, ""]);
  const removeMeta = (i: number) => setMetasMes(prev => prev.filter((_, ii) => ii !== i));

  const addPrioridade = () => setPrioridades(prev => [...prev, ""]);
  const removePrioridade = (i: number) => setPrioridades(prev => prev.filter((_, ii) => ii !== i));

  const addProva = () => setProvas(prev => [...prev, { data: "", materia: "" }]);
  const removeProva = (i: number) => setProvas(prev => prev.filter((_, ii) => ii !== i));

  const addTarefa = () => setTarefas(prev => [...prev, { done: false, texto: "" }]);
  const removeTarefa = (i: number) => setTarefas(prev => prev.filter((_, ii) => ii !== i));

  const kawaiiBtnStyle = {
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    fontSize: "0.8rem",
    padding: "0.2rem"
  };

  const addBtnStyle = {
    ...kawaiiBtnStyle,
    background: "#BFD8B8",
    color: "#FFF",
    width: 22,
    height: 22,
    borderRadius: "50%",
    fontWeight: "bold"
  };

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      {/* Header */}
      <div style={{ background: "#BFD8B8", borderBottom: "3px solid #7BA87A", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_CALENDARIO} alt="Gatinhos calendário" style={{ width: 60, height: 60, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#3D5C3A" }}>🗓️ Planner Mensal</h1>
              <p style={{ color: "#5A7A58", fontSize: "0.85rem", fontWeight: 600 }}>Organize seu mês com foco e tranquilidade</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#3D5C3A", borderColor: "#3D5C3A" }} onClick={() => navigate("/")}>
            ← Índice
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Foco do mês */}
        <div className="planner-card" style={{ padding: "1.25rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="field-label" style={{ marginBottom: "0.4rem" }}>🎯 Foco do Mês</div>
            <input
              value={focoDomes}
              onChange={e => setFocoDomes(e.target.value)}
              placeholder="Uma palavra ou frase que define este mês..."
              style={{
                width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem",
                padding: "0.6rem 0.9rem", fontFamily: "'Nunito', sans-serif",
                fontWeight: 800, fontSize: "1rem", color: "#5B3A29", background: "#FFFBF3",
                outline: "none",
              }}
            />
          </div>
          <div style={{ flex: 2, minWidth: 260 }}>
            <div className="field-label" style={{ marginBottom: "0.4rem" }}>💭 Reflexão do Mês Anterior</div>
            <textarea
              value={reflexao}
              onChange={e => setReflexao(e.target.value)}
              placeholder="O que funcionou? O que quero melhorar?"
              rows={2}
              style={{
                width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem",
                padding: "0.6rem 0.9rem", fontFamily: "'Nunito', sans-serif",
                fontWeight: 500, fontSize: "0.88rem", color: "#5B3A29", background: "#FFFBF3",
                outline: "none", resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* Calendário + lateral */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.25rem" }}>
          {/* Calendário */}
          <div className="planner-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <button onClick={() => mudarMes(-1)} style={{ background: "#F5EDE0", border: "2px solid #E8D5C0", borderRadius: "0.6rem", padding: "0.3rem 0.7rem", fontWeight: 700, color: "#5B3A29", cursor: "pointer" }}>‹</button>
              <h2 className="section-title" style={{ fontSize: "1.2rem" }}>{meses[mesAtual]} {anoAtual}</h2>
              <button onClick={() => mudarMes(1)} style={{ background: "#F5EDE0", border: "2px solid #E8D5C0", borderRadius: "0.6rem", padding: "0.3rem 0.7rem", fontWeight: 700, color: "#5B3A29", cursor: "pointer" }}>›</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {diasSemana.map((d, i) => (
                <div key={i} style={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 800, color: "#A96F45", padding: "4px 0" }}>{d}</div>
              ))}
              {cells.map((cell, i) => (
                <div
                  key={i}
                  style={{
                    minHeight: 52,
                    borderRadius: "0.5rem",
                    border: cell ? "1.5px solid #E8D5C0" : "none",
                    background: cell ? "#FFFBF3" : "transparent",
                    padding: "2px 4px",
                    position: "relative",
                  }}
                >
                  {cell && (
                    <>
                      <div style={{
                        fontSize: "0.72rem", fontWeight: 800,
                        background: cell === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear() ? "#A96F45" : "transparent",
                        color: cell === hoje.getDate() && mesAtual === hoje.getMonth() && anoAtual === hoje.getFullYear() ? "#FFF7EA" : "#5B3A29",
                        borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{cell}</div>
                      <textarea
                        value={notas[cell] || ""}
                        onChange={e => setNotas(prev => ({ ...prev, [cell]: e.target.value }))}
                        style={{
                          width: "100%", fontSize: "0.6rem", color: "#8B6347",
                          border: "none", background: "transparent", resize: "none",
                          fontFamily: "'Nunito', sans-serif", outline: "none", minHeight: 28,
                        }}
                        placeholder="..."
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Lateral: metas, prioridades, provas */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Metas do mês */}
            <div className="planner-card" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <div className="field-label">🌟 Metas do Mês</div>
                <button onClick={addMeta} style={addBtnStyle}>+</button>
              </div>
              {metasMes.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: "0.3rem", alignItems: "center", marginBottom: "0.4rem" }}>
                  <span style={{ color: "#F7D98B", fontSize: "0.9rem" }}>★</span>
                  <input
                    value={m}
                    onChange={e => { const n=[...metasMes]; n[i]=e.target.value; setMetasMes(n); }}
                    placeholder={`Meta...`}
                    style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.8rem", color:"#5B3A29", background:"transparent", outline:"none" }}
                  />
                  <button onClick={() => removeMeta(i)} style={{ ...kawaiiBtnStyle, background: "transparent", color: "#F4B7C3" }}>❌</button>
                </div>
              ))}
            </div>

            {/* Prioridades */}
            <div className="planner-card" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <div className="field-label">🔥 Prioridades</div>
                <button onClick={addPrioridade} style={addBtnStyle}>+</button>
              </div>
              {prioridades.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "0.3rem", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div style={{ width:14, height:14, borderRadius:4, background:["#F4B7C3","#B9DDE7","#BFD8B8","#F7D98B"][i % 4], flexShrink:0 }} />
                  <input
                    value={p}
                    onChange={e => { const n=[...prioridades]; n[i]=e.target.value; setPrioridades(n); }}
                    placeholder={`Prioridade...`}
                    style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.8rem", color:"#5B3A29", background:"transparent", outline:"none" }}
                  />
                  <button onClick={() => removePrioridade(i)} style={{ ...kawaiiBtnStyle, background: "transparent", color: "#F4B7C3" }}>❌</button>
                </div>
              ))}
            </div>

            {/* Provas e trabalhos */}
            <div className="planner-card" style={{ padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
                <div className="field-label">📝 Provas & Trabalhos</div>
                <button onClick={addProva} style={addBtnStyle}>+</button>
              </div>
              {provas.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: "0.3rem", marginBottom: "0.4rem", alignItems: "center" }}>
                  <input
                    value={p.data}
                    onChange={e => { const n=[...provas]; n[i]={...n[i],data:e.target.value}; setProvas(n); }}
                    placeholder="DD/MM"
                    style={{ width:42, border:"2px solid #E8D5C0", borderRadius:"0.5rem", padding:"0.2rem", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"0.7rem", color:"#5B3A29", background:"#FFFBF3", outline:"none", textAlign:"center" }}
                  />
                  <input
                    value={p.materia}
                    onChange={e => { const n=[...provas]; n[i]={...n[i],materia:e.target.value}; setProvas(n); }}
                    placeholder="Descrição..."
                    style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.2rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.75rem", color:"#5B3A29", background:"transparent", outline:"none" }}
                  />
                  <button onClick={() => removeProva(i)} style={{ ...kawaiiBtnStyle, background: "transparent", color: "#F4B7C3" }}>❌</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tarefas do mês */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 4, height: 22, background: "#BFD8B8", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1.1rem" }}>✅ Tarefas Importantes do Mês</h2>
            </div>
            <button onClick={addTarefa} style={addBtnStyle}>+</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {tarefas.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div
                  className={`habit-check ${t.done ? "checked" : ""}`}
                  onClick={() => { const n=[...tarefas]; n[i]={...n[i],done:!n[i].done}; setTarefas(n); }}
                >
                  {t.done && <span style={{ fontSize: "0.75rem" }}>✓</span>}
                </div>
                <input
                  value={t.texto}
                  onChange={e => { const n=[...tarefas]; n[i]={...n[i],texto:e.target.value}; setTarefas(n); }}
                  placeholder={`Tarefa...`}
                  style={{
                    flex: 1, border: "none", borderBottom: "1.5px dotted #D4B896",
                    padding: "0.4rem 0.2rem", fontFamily: "'Nunito', sans-serif",
                    fontWeight: 500, fontSize: "0.88rem",
                    color: t.done ? "#B0A090" : "#5B3A29",
                    textDecoration: t.done ? "line-through" : "none",
                    background: "transparent", outline: "none",
                  }}
                />
                <button onClick={() => removeTarefa(i)} style={{ ...kawaiiBtnStyle, background: "transparent", color: "#F4B7C3", fontSize: "0.9rem" }}>🗑️</button>
              </div>
            ))}
          </div>
        </div>

        {/* Navegação */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/planner-anual")}>
            ← Visão Anual
          </button>
          <button className="nav-btn" onClick={() => navigate("/planner-semanal")}>
            Planner Semanal →
          </button>
        </div>
      </div>
    </div>
  );
}
