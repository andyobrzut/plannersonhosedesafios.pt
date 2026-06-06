/* =============================================================
   PÁGINA: Planner Semanal — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";
import { AddKawaiiButton, DeleteKawaiiButton } from "@/components/KawaiiListActions";

const GATINHOS_HABITOS = "/assets/kawaii/kawaii_habitos.png";

const dias = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];

export default function PlannerSemanal() {
  const [, navigate] = useLocation();
  const [semana, setSemana] = useLocalStorage('planner_plannersemanal_semana', "");
  const [focoDaSemana, setFocoDaSemana] = useLocalStorage('planner_plannersemanal_focodasemana', "");
  const [tarefas, setTarefas] = useLocalStorage('planner_plannersemanal_tarefas', Object.fromEntries(dias.map(d => [d, [{done:false,texto:""},{done:false,texto:""},{done:false,texto:""}]])));
  const [notas, setNotas] = useLocalStorage('planner_plannersemanal_notas', Object.fromEntries(dias.map(d => [d, ""])));
  const [metasSemana, setMetasSemana] = useLocalStorage('planner_plannersemanal_metassemana', ["","","",""]);
  const [habitos, setHabitos] = useLocalStorage('planner_plannersemanal_habitos', [
    {nome:"💧 Água (2L)", dias: Object.fromEntries(dias.map(d=>[d,false]))},
    {nome:"🏃 Exercício", dias: Object.fromEntries(dias.map(d=>[d,false]))},
    {nome:"📚 Estudar", dias: Object.fromEntries(dias.map(d=>[d,false]))},
    {nome:"😴 Dormir 8h", dias: Object.fromEntries(dias.map(d=>[d,false]))},
  ]);

  const toggleHabito = (hi: number, dia: string) => {
    setHabitos(prev => {
      const n = [...prev];
      n[hi] = { ...n[hi], dias: { ...n[hi].dias, [dia]: !n[hi].dias[dia] } };
      return n;
    });
  };

  const toggleTarefa = (dia: string, ti: number) => {
    setTarefas(prev => {
      const n = { ...prev };
      n[dia] = n[dia].map((t, i) => i === ti ? { ...t, done: !t.done } : t);
      return n;
    });
  };

  const addMetaSemana = () => setMetasSemana(prev => [...prev, ""]);
  const removeMetaSemana = (index: number) => setMetasSemana(prev => prev.filter((_, i) => i !== index));
  const addTarefaDia = (dia: string) => setTarefas(prev => ({ ...prev, [dia]: [...prev[dia], { done: false, texto: "" }] }));
  const removeTarefaDia = (dia: string, index: number) => setTarefas(prev => ({ ...prev, [dia]: prev[dia].filter((_, i) => i !== index) }));
  const addHabito = () => setHabitos(prev => [...prev, { nome: "Novo hábito", dias: Object.fromEntries(dias.map(d => [d, false])) }]);
  const removeHabito = (index: number) => setHabitos(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      {/* Header */}
      <div style={{ background: "#B9DDE7", borderBottom: "3px solid #7BB8C8", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_HABITOS} alt="Gatinhos planejando" style={{ width: 60, height: 60, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#2A5A6A" }}>📋 Planner Semanal</h1>
              <p style={{ color: "#3A7A8A", fontSize: "0.85rem", fontWeight: 600 }}>Organize sua semana com clareza e foco</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#2A5A6A", borderColor: "#2A5A6A" }} onClick={() => navigate("/")}>
            ← Índice
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

        {/* Cabeçalho da semana */}
        <div className="planner-card" style={{ padding: "1.25rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>📅 Semana de</div>
            <input
              value={semana}
              onChange={e => setSemana(e.target.value)}
              placeholder="Ex: 02/06 a 08/06/2025"
              style={{ border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>🎯 Foco da Semana</div>
            <input
              value={focoDaSemana}
              onChange={e => setFocoDaSemana(e.target.value)}
              placeholder="Uma coisa que precisa acontecer esta semana..."
              style={{ width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }}
            />
          </div>
          <div style={{ minWidth: 200 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
              <div className="field-label">🌟 Metas da Semana</div>
              <AddKawaiiButton onClick={addMetaSemana} title="Incluir meta da semana" />
            </div>
            {metasSemana.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.3rem" }}>
                <span style={{ color: "#F7D98B", fontSize: "0.8rem" }}>★</span>
                <input
                  value={m}
                  onChange={e => { const n=[...metasSemana]; n[i]=e.target.value; setMetasSemana(n); }}
                  placeholder={`Meta ${i+1}...`}
                  style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.25rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.78rem", color:"#5B3A29", background:"transparent", outline:"none" }}
                />
                <DeleteKawaiiButton onClick={() => removeMetaSemana(i)} title="Excluir meta da semana" />
              </div>
            ))}
          </div>
        </div>

        {/* Grade semanal */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0.75rem" }}>
          {dias.map((dia, di) => {
            const cores = ["#F4B7C3","#B9DDE7","#BFD8B8","#F7D98B","#F4B7C3","#B9DDE7","#BFD8B8"];
            const coresBorda = ["#E8899A","#7BB8C8","#7BA87A","#E8C55A","#E8899A","#7BB8C8","#7BA87A"];
            return (
              <div key={dia} style={{ background: "#FFFBF3", borderRadius: "1rem", border: `2px solid ${coresBorda[di]}`, padding: "0.75rem 0.6rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ background: cores[di], borderRadius: "0.6rem", padding: "0.3rem 0.5rem", textAlign: "center", fontWeight: 800, fontSize: "0.78rem", color: "#5B3A29", marginBottom: "0.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.25rem" }}>
                  <span>{dia}</span>
                  <AddKawaiiButton onClick={() => addTarefaDia(dia)} title={`Incluir tarefa em ${dia}`} />
                </div>
                {tarefas[dia].map((t, ti) => (
                  <div key={ti} style={{ display: "flex", gap: "0.3rem", alignItems: "flex-start" }}>
                    <div
                      className={`habit-check ${t.done ? "checked" : ""}`}
                      style={{ marginTop: 2, width: 16, height: 16, borderRadius: 4 }}
                      onClick={() => toggleTarefa(dia, ti)}
                    >
                      {t.done && <span style={{ fontSize: "0.6rem" }}>✓</span>}
                    </div>
                    <input
                      value={t.texto}
                      onChange={e => {
                        setTarefas(prev => {
                          const n = { ...prev };
                          n[dia] = n[dia].map((tt, i) => i === ti ? { ...tt, texto: e.target.value } : tt);
                          return n;
                        });
                      }}
                      placeholder="Tarefa..."
                      style={{ flex:1, border:"none", borderBottom:"1px dotted #D4B896", padding:"0.2rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.7rem", color: t.done ? "#B0A090" : "#5B3A29", textDecoration: t.done ? "line-through" : "none", background:"transparent", outline:"none" }}
                    />
                    <DeleteKawaiiButton onClick={() => removeTarefaDia(dia, ti)} title={`Excluir tarefa de ${dia}`} />
                  </div>
                ))}
                <textarea
                  value={notas[dia]}
                  onChange={e => setNotas(prev => ({ ...prev, [dia]: e.target.value }))}
                  placeholder="Notas..."
                  rows={2}
                  style={{ border:"none", borderTop:"1px dashed #E8D5C0", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:400, fontSize:"0.68rem", color:"#8B6347", background:"transparent", outline:"none", resize:"none", marginTop:"0.25rem" }}
                />
              </div>
            );
          })}
        </div>

        {/* Mini rastreador de hábitos */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 4, height: 22, background: "#B9DDE7", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1rem" }}>Mini Rastreador de Hábitos</h2>
            </div>
            <AddKawaiiButton onClick={addHabito} title="Incluir hábito" />
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#8B6347", paddingBottom: "0.4rem", minWidth: 120 }}>Hábito</th>
                  {dias.map(d => (
                    <th key={d} style={{ textAlign: "center", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "#8B6347", paddingBottom: "0.4rem" }}>{d.slice(0,3)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {habitos.map((h, hi) => (
                  <tr key={hi}>
                    <td style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#5B3A29", paddingRight: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        <input value={h.nome} onChange={e => setHabitos(prev => prev.map((hh, i) => i === hi ? { ...hh, nome: e.target.value } : hh))} style={{ flex: 1, border: "none", borderBottom: "1px dotted #D4B896", background: "transparent", outline: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#5B3A29" }} />
                        <DeleteKawaiiButton onClick={() => removeHabito(hi)} title="Excluir hábito" />
                      </div>
                    </td>
                    {dias.map(dia => (
                      <td key={dia} style={{ textAlign: "center" }}>
                        <div
                          className={`habit-check ${h.dias[dia] ? "checked" : ""}`}
                          style={{ margin: "0 auto" }}
                          onClick={() => toggleHabito(hi, dia)}
                        >
                          {h.dias[dia] && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navegação */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/planner-mensal")}>
            ← Planner Mensal
          </button>
          <button className="nav-btn" onClick={() => navigate("/planner-diario")}>
            Planner Diário →
          </button>
        </div>
      </div>
    </div>
  );
}
