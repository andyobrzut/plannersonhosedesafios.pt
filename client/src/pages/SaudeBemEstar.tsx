/* =============================================================
   PÁGINA: Saúde & Bem-Estar — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";
import { AddKawaiiButton, DeleteKawaiiButton } from "@/components/KawaiiListActions";

const GATINHOS_SAUDE = "/assets/kawaii/kawaii_saude.png";

const diasSemana = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];

export default function SaudeBemEstar() {
  const [, navigate] = useLocation();
  const [sono, setSono] = useLocalStorage<Record<string, string>>('planner_saudebemestar_sono', Object.fromEntries(diasSemana.map(d => [d, ""])));
  const [humor, setHumor] = useLocalStorage<Record<string, number>>('planner_saudebemestar_humor', Object.fromEntries(diasSemana.map(d => [d, 0])));
  const [exercicios, setExercicios] = useLocalStorage<Record<string, string>>('planner_saudebemestar_exercicios', Object.fromEntries(diasSemana.map(d => [d, ""])));
  const [agua, setAgua] = useLocalStorage<Record<string, number>>('planner_saudebemestar_agua', Object.fromEntries(diasSemana.map(d => [d, 0])));
  const [autocuidado, setAutocuidado] = useLocalStorage('planner_saudebemestar_autocuidado', [
    { done: false, texto: "Tomar sol por 15 minutos" },
    { done: false, texto: "Fazer alongamento" },
    { done: false, texto: "Ler por prazer" },
    { done: false, texto: "Ligar para alguém querido" },
    { done: false, texto: "Descansar sem culpa" },
    { done: false, texto: "" },
  ]);
  const [sintomas, setSintomas] = useLocalStorage('planner_saudebemestar_sintomas', "");
  const [medicamentos, setMedicamentos] = useLocalStorage('planner_saudebemestar_medicamentos', [{nome:"",horario:""},{nome:"",horario:""},{nome:"",horario:""}]);
  const [consultas, setConsultas] = useLocalStorage('planner_saudebemestar_consultas', [{data:"",medico:""},{data:"",medico:""},{data:"",medico:""}]);

  const humorEmojis = ["", "😞", "😐", "🙂", "😊", "🤩"];

  const addAutocuidado = () => setAutocuidado(prev => [...prev, { done: false, texto: "" }]);
  const removeAutocuidado = (index: number) => setAutocuidado(prev => prev.filter((_, i) => i !== index));
  const addMedicamento = () => setMedicamentos(prev => [...prev, { nome: "", horario: "" }]);
  const removeMedicamento = (index: number) => setMedicamentos(prev => prev.filter((_, i) => i !== index));
  const addConsulta = () => setConsultas(prev => [...prev, { data: "", medico: "" }]);
  const removeConsulta = (index: number) => setConsultas(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      <div style={{ background: "#F4B7C3", borderBottom: "3px solid #E8899A", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_SAUDE} alt="Gatinhos saúde" style={{ width: 60, height: 60, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#7A2D3E" }}>🌿 Saúde & Bem-Estar</h1>
              <p style={{ color: "#9A4D5E", fontSize: "0.85rem", fontWeight: 600 }}>Cuide do seu corpo e mente com carinho</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#7A2D3E", borderColor: "#7A2D3E" }} onClick={() => navigate("/")}>← Índice</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Rastreador semanal */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ width: 4, height: 22, background: "#F4B7C3", borderRadius: 4 }} />
            <h2 className="section-title" style={{ fontSize: "1.1rem" }}>Rastreador Semanal de Saúde</h2>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.75rem", color: "#8B6347", paddingBottom: "0.5rem", minWidth: 120 }}>Indicador</th>
                  {diasSemana.map(d => (
                    <th key={d} style={{ textAlign: "center", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#8B6347", paddingBottom: "0.5rem" }}>{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#5B3A29" }}>😴 Sono (h)</td>
                  {diasSemana.map(d => (
                    <td key={d} style={{ textAlign: "center", padding: "2px 4px" }}>
                      <input value={sono[d]} onChange={e => setSono(p => ({ ...p, [d]: e.target.value }))} placeholder="8" style={{ width: 36, textAlign: "center", border: "2px solid #F4B7C3", borderRadius: "0.4rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#5B3A29", background: "#FFFBF3", outline: "none", padding: "0.2rem" }} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#5B3A29" }}>😊 Humor (1-5)</td>
                  {diasSemana.map(d => (
                    <td key={d} style={{ textAlign: "center", padding: "2px 4px" }}>
                      <select value={humor[d]} onChange={e => setHumor(p => ({ ...p, [d]: Number(e.target.value) }))} style={{ width: 44, border: "2px solid #F4B7C3", borderRadius: "0.4rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#5B3A29", background: "#FFFBF3", outline: "none", padding: "0.2rem" }}>
                        {[0,1,2,3,4,5].map(v => <option key={v} value={v}>{v === 0 ? "-" : humorEmojis[v]}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#5B3A29" }}>🏃 Exercício</td>
                  {diasSemana.map(d => (
                    <td key={d} style={{ textAlign: "center", padding: "2px 4px" }}>
                      <input value={exercicios[d]} onChange={e => setExercicios(p => ({ ...p, [d]: e.target.value }))} placeholder="..." style={{ width: 50, textAlign: "center", border: "2px solid #BFD8B8", borderRadius: "0.4rem", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.7rem", color: "#5B3A29", background: "#FFFBF3", outline: "none", padding: "0.2rem" }} />
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#5B3A29" }}>💧 Água (copos)</td>
                  {diasSemana.map(d => (
                    <td key={d} style={{ textAlign: "center", padding: "2px 4px" }}>
                      <input value={agua[d] || ""} onChange={e => setAgua(p => ({ ...p, [d]: Number(e.target.value) }))} placeholder="8" style={{ width: 36, textAlign: "center", border: "2px solid #B9DDE7", borderRadius: "0.4rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#5B3A29", background: "#FFFBF3", outline: "none", padding: "0.2rem" }} />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Autocuidado + Medicamentos + Consultas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="planner-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 4, height: 22, background: "#F4B7C3", borderRadius: 4 }} />
                  <h2 className="section-title" style={{ fontSize: "1rem" }}>🌸 Lista de Autocuidado</h2>
                </div>
                <AddKawaiiButton onClick={addAutocuidado} title="Incluir autocuidado" />
              </div>
              {autocuidado.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div className={`habit-check ${item.done ? "checked" : ""}`} onClick={() => setAutocuidado(prev => prev.map((a, ii) => ii === i ? { ...a, done: !a.done } : a))}>
                    {item.done && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                  </div>
                  <input value={item.texto} onChange={e => setAutocuidado(prev => prev.map((a, ii) => ii === i ? { ...a, texto: e.target.value } : a))} placeholder="Atividade de autocuidado..." style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.82rem", color: item.done ? "#B0A090" : "#5B3A29", textDecoration: item.done ? "line-through" : "none", background:"transparent", outline:"none" }} />
                  <DeleteKawaiiButton onClick={() => removeAutocuidado(i)} title="Excluir autocuidado" />
                </div>
              ))}
            </div>

            <div className="planner-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div className="field-label">💊 Medicamentos & Suplementos</div>
                <AddKawaiiButton onClick={addMedicamento} title="Incluir medicamento" />
              </div>
              {medicamentos.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <input value={m.nome} onChange={e => setMedicamentos(prev => prev.map((mm, ii) => ii === i ? { ...mm, nome: e.target.value } : mm))} placeholder="Nome..." style={{ flex:2, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.8rem", color:"#5B3A29", background:"transparent", outline:"none" }} />
                  <input value={m.horario} onChange={e => setMedicamentos(prev => prev.map((mm, ii) => ii === i ? { ...mm, horario: e.target.value } : mm))} placeholder="Horário" style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.8rem", color:"#A96F45", background:"transparent", outline:"none" }} />
                  <DeleteKawaiiButton onClick={() => removeMedicamento(i)} title="Excluir medicamento" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="planner-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div className="field-label">🏥 Consultas & Exames</div>
                <AddKawaiiButton onClick={addConsulta} title="Incluir consulta" />
              </div>
              {consultas.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem" }}>
                  <input value={c.data} onChange={e => setConsultas(prev => prev.map((cc, ii) => ii === i ? { ...cc, data: e.target.value } : cc))} placeholder="DD/MM" style={{ width: 60, border:"2px solid #E8D5C0", borderRadius:"0.5rem", padding:"0.3rem 0.4rem", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"0.78rem", color:"#5B3A29", background:"#FFFBF3", outline:"none", textAlign:"center" }} />
                  <input value={c.medico} onChange={e => setConsultas(prev => prev.map((cc, ii) => ii === i ? { ...cc, medico: e.target.value } : cc))} placeholder="Médico / Exame..." style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.8rem", color:"#5B3A29", background:"transparent", outline:"none" }} />
                  <DeleteKawaiiButton onClick={() => removeConsulta(i)} title="Excluir consulta" />
                </div>
              ))}
            </div>

            <div className="planner-card" style={{ padding: "1.25rem" }}>
              <div className="field-label" style={{ marginBottom: "0.5rem" }}>📝 Sintomas & Observações</div>
              <textarea value={sintomas} onChange={e => setSintomas(e.target.value)} placeholder="Registre como seu corpo está se sentindo..." rows={5} style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.6rem 0.9rem", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.85rem", color:"#5B3A29", background:"#FFFBF3", outline:"none", resize:"vertical" }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/financeiro")}>← Finanças</button>
          <button className="nav-btn" onClick={() => navigate("/academico")}>Planner Acadêmico →</button>
        </div>
      </div>
    </div>
  );
}
