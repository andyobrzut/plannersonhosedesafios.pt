/* =============================================================
   PÁGINA: Planner Acadêmico — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";

const GATINHOS_PROVAS = "/assets/kawaii/kawaii_provas.png";

interface Disciplina {
  nome: string;
  professor: string;
  nota1: string;
  nota2: string;
  nota3: string;
  faltas: string;
  maxFaltas: string;
  cor: string;
}

interface Prova {
  data: string;
  materia: string;
  tipo: string;
}

interface Trabalho {
  entrega: string;
  descricao: string;
  done: boolean;
}

const coresDisciplinas = ["#F4B7C3","#B9DDE7","#BFD8B8","#F7D98B","#F4B7C3","#B9DDE7","#BFD8B8","#F7D98B"];

export default function PlannerAcademico() {
  const [, navigate] = useLocation();
  const [semestre, setSemestre] = useLocalStorage('planner_planneracademico_semestre', "1º Semestre 2025");
  const [curso, setCurso] = useLocalStorage('planner_planneracademico_curso', "");
  const [disciplinas, setDisciplinas] = useLocalStorage<Disciplina[]>('planner_academico_disciplinas', [
    { nome: "", professor: "", nota1: "", nota2: "", nota3: "", faltas: "0", maxFaltas: "15", cor: "#F4B7C3" },
    { nome: "", professor: "", nota1: "", nota2: "", nota3: "", faltas: "0", maxFaltas: "15", cor: "#B9DDE7" },
    { nome: "", professor: "", nota1: "", nota2: "", nota3: "", faltas: "0", maxFaltas: "15", cor: "#BFD8B8" },
    { nome: "", professor: "", nota1: "", nota2: "", nota3: "", faltas: "0", maxFaltas: "15", cor: "#F7D98B" },
    { nome: "", professor: "", nota1: "", nota2: "", nota3: "", faltas: "0", maxFaltas: "15", cor: "#F4B7C3" },
  ]);
  const [metaAcademica, setMetaAcademica] = useLocalStorage('planner_planneracademico_metaacademica', "");
  const [provas, setProvas] = useLocalStorage<Prova[]>('planner_planneracademico_provas', [{data:"",materia:"",tipo:""},{data:"",materia:"",tipo:""},{data:"",materia:"",tipo:""}]);
  const [trabalhos, setTrabalhos] = useLocalStorage<Trabalho[]>('planner_planneracademico_trabalhos', [{entrega:"",descricao:"",done:false},{entrega:"",descricao:"",done:false}]);

  const calcMedia = (d: Disciplina) => {
    const notas = [d.nota1, d.nota2, d.nota3].map(n => parseFloat(n.replace(",","."))).filter(n => !isNaN(n));
    if (notas.length === 0) return null;
    return (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1);
  };

  const updateDisciplina = (i: number, field: keyof Disciplina, value: string) => {
    setDisciplinas(prev => prev.map((d, ii) => ii === i ? { ...d, [field]: value } : d));
  };

  const addDisciplina = () => {
    setDisciplinas(prev => [...prev, { nome: "", professor: "", nota1: "", nota2: "", nota3: "", faltas: "0", maxFaltas: "15", cor: coresDisciplinas[prev.length % coresDisciplinas.length] }]);
  };

  const removeDisciplina = (i: number) => {
    setDisciplinas(prev => prev.filter((_, ii) => ii !== i));
  };

  const addProva = () => {
    setProvas(prev => [...prev, { data: "", materia: "", tipo: "" }]);
  };

  const removeProva = (i: number) => {
    setProvas(prev => prev.filter((_, ii) => ii !== i));
  };

  const addTrabalho = () => {
    setTrabalhos(prev => [...prev, { entrega: "", descricao: "", done: false }]);
  };

  const removeTrabalho = (i: number) => {
    setTrabalhos(prev => prev.filter((_, ii) => ii !== i));
  };

  const kawaiiBtnStyle = {
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    fontSize: "0.9rem"
  };

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      <div style={{ background: "#A96F45", borderBottom: "3px solid #7A4E30", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_PROVAS} alt="Gatinhos estudando" style={{ width: 60, height: 60, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#FFF7EA" }}>🎓 Planner Acadêmico</h1>
              <p style={{ color: "#F5EDE0", fontSize: "0.85rem", fontWeight: 600 }}>Organize suas disciplinas, notas e prazos</p>
            </div>
          </div>
          <button className="nav-btn" style={{ background: "#FFF7EA", color: "#A96F45" }} onClick={() => navigate("/")}>← Índice</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Info do semestre */}
        <div className="planner-card" style={{ padding: "1.25rem", display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>📅 Semestre</div>
            <input value={semestre} onChange={e => setSemestre(e.target.value)} style={{ border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>🎓 Curso / Escola</div>
            <input value={curso} onChange={e => setCurso(e.target.value)} placeholder="Nome do curso ou escola..." style={{ width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }} />
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>🌟 Meta Acadêmica do Semestre</div>
            <input value={metaAcademica} onChange={e => setMetaAcademica(e.target.value)} placeholder="Ex: Passar em todas as matérias com 7+" style={{ width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }} />
          </div>
        </div>

        {/* Disciplinas */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 4, height: 22, background: "#A96F45", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1.1rem" }}>📚 Disciplinas do Semestre</h2>
            </div>
            <button className="nav-btn" style={{ fontSize: "0.78rem", padding: "0.3rem 0.75rem" }} onClick={addDisciplina}>+ Disciplina</button>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E8D5C0" }}>
                  {["Disciplina","Professor","Nota 1","Nota 2","Nota 3","Média","Faltas","Status", ""].map(h => (
                    <th key={h} style={{ textAlign: "left", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.72rem", color: "#8B6347", padding: "0.4rem 0.5rem", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {disciplinas.map((d, i) => {
                  const media = calcMedia(d);
                  const aprovada = media !== null && parseFloat(media) >= 5;
                  const faltasNum = parseInt(d.faltas) || 0;
                  const maxFaltasNum = parseInt(d.maxFaltas) || 15;
                  const reprovadaFaltas = faltasNum > maxFaltasNum;
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #F0E4D0" }}>
                      <td style={{ padding: "0.4rem 0.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: d.cor, flexShrink: 0 }} />
                          <input value={d.nome} onChange={e => updateDisciplina(i, "nome", e.target.value)} placeholder="Nome da disciplina..." style={{ width: 130, border: "none", borderBottom: "1.5px dotted #D4B896", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#5B3A29", background: "transparent", outline: "none" }} />
                        </div>
                      </td>
                      <td style={{ padding: "0.4rem 0.5rem" }}>
                        <input value={d.professor} onChange={e => updateDisciplina(i, "professor", e.target.value)} placeholder="Prof..." style={{ width: 100, border: "none", borderBottom: "1.5px dotted #D4B896", fontFamily: "'Nunito',sans-serif", fontWeight: 500, fontSize: "0.78rem", color: "#5B3A29", background: "transparent", outline: "none" }} />
                      </td>
                      {["nota1","nota2","nota3"].map(campo => (
                        <td key={campo} style={{ padding: "0.4rem 0.5rem" }}>
                          <input value={d[campo as keyof Disciplina]} onChange={e => updateDisciplina(i, campo as keyof Disciplina, e.target.value)} placeholder="0,0" style={{ width: 44, textAlign: "center", border: "2px solid #E8D5C0", borderRadius: "0.4rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#5B3A29", background: "#FFFBF3", outline: "none", padding: "0.2rem" }} />
                        </td>
                      ))}
                      <td style={{ padding: "0.4rem 0.5rem" }}>
                        <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "0.95rem", color: media === null ? "#B0A090" : aprovada ? "#3D5C3A" : "#7A2D3E" }}>
                          {media ?? "-"}
                        </div>
                      </td>
                      <td style={{ padding: "0.4rem 0.5rem" }}>
                        <div style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                          <input value={d.faltas} onChange={e => updateDisciplina(i, "faltas", e.target.value)} style={{ width: 32, textAlign: "center", border: "2px solid #E8D5C0", borderRadius: "0.4rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.78rem", color: reprovadaFaltas ? "#7A2D3E" : "#5B3A29", background: reprovadaFaltas ? "#FFE8EC" : "#FFFBF3", outline: "none", padding: "0.2rem" }} />
                          <span style={{ fontSize: "0.7rem", color: "#8B6347" }}>/{d.maxFaltas}</span>
                        </div>
                      </td>
                      <td style={{ padding: "0.4rem 0.5rem" }}>
                        {media !== null ? (
                          <span style={{ background: reprovadaFaltas ? "#F4B7C3" : aprovada ? "#BFD8B8" : "#F4B7C3", color: reprovadaFaltas ? "#7A2D3E" : aprovada ? "#3D5C3A" : "#7A2D3E", borderRadius: "999px", padding: "0.15rem 0.6rem", fontSize: "0.7rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                            {reprovadaFaltas ? "⚠️ Faltas" : aprovada ? "✅ Aprovada" : "❌ Atenção"}
                          </span>
                        ) : <span style={{ color: "#B0A090", fontSize: "0.75rem" }}>—</span>}
                      </td>
                      <td style={{ padding: "0.4rem 0.5rem" }}>
                        <button onClick={() => removeDisciplina(i)} style={{ ...kawaiiBtnStyle, background: "#FFE8EC", color: "#7A2D3E", padding: "0.3rem" }} title="Excluir disciplina">🗑️</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provas e trabalhos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
          <div className="planner-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 4, height: 22, background: "#F4B7C3", borderRadius: 4 }} />
                <h2 className="section-title" style={{ fontSize: "1rem" }}>📝 Provas & Avaliações</h2>
              </div>
              <button onClick={addProva} style={{ ...kawaiiBtnStyle, background: "#F4B7C3", color: "#FFF", width: 24, height: 24, borderRadius: "50%", fontWeight: "bold" }}>+</button>
            </div>
            {provas.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", alignItems: "center" }}>
                <input value={p.data} onChange={e => setProvas(prev => prev.map((pp, ii) => ii === i ? { ...pp, data: e.target.value } : pp))} placeholder="DD/MM" style={{ width: 52, border: "2px solid #E8D5C0", borderRadius: "0.5rem", padding: "0.3rem 0.4rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#5B3A29", background: "#FFFBF3", outline: "none", textAlign: "center" }} />
                <input value={p.materia} onChange={e => setProvas(prev => prev.map((pp, ii) => ii === i ? { ...pp, materia: e.target.value } : pp))} placeholder="Matéria..." style={{ flex: 2, border: "none", borderBottom: "1.5px dotted #D4B896", padding: "0.3rem 0", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#5B3A29", background: "transparent", outline: "none" }} />
                <input value={p.tipo} onChange={e => setProvas(prev => prev.map((pp, ii) => ii === i ? { ...pp, tipo: e.target.value } : pp))} placeholder="Tipo" style={{ flex: 1, border: "none", borderBottom: "1.5px dotted #D4B896", padding: "0.3rem 0", fontFamily: "'Nunito',sans-serif", fontWeight: 500, fontSize: "0.75rem", color: "#8B6347", background: "transparent", outline: "none" }} />
                <button onClick={() => removeProva(i)} style={{ ...kawaiiBtnStyle, background: "transparent", color: "#F4B7C3", padding: "0.2rem", fontSize: "0.8rem" }}>❌</button>
              </div>
            ))}
          </div>

          <div className="planner-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{ width: 4, height: 22, background: "#BFD8B8", borderRadius: 4 }} />
                <h2 className="section-title" style={{ fontSize: "1rem" }}>📋 Trabalhos & Entregas</h2>
              </div>
              <button onClick={addTrabalho} style={{ ...kawaiiBtnStyle, background: "#BFD8B8", color: "#FFF", width: 24, height: 24, borderRadius: "50%", fontWeight: "bold" }}>+</button>
            </div>
            {trabalhos.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.5rem", alignItems: "center" }}>
                <div className={`habit-check ${t.done ? "checked" : ""}`} onClick={() => setTrabalhos(prev => prev.map((tt, ii) => ii === i ? { ...tt, done: !tt.done } : tt))}>
                  {t.done && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                </div>
                <input value={t.entrega} onChange={e => setTrabalhos(prev => prev.map((tt, ii) => ii === i ? { ...tt, entrega: e.target.value } : tt))} placeholder="DD/MM" style={{ width: 52, border: "2px solid #E8D5C0", borderRadius: "0.5rem", padding: "0.3rem 0.4rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: "#5B3A29", background: "#FFFBF3", outline: "none", textAlign: "center" }} />
                <input value={t.descricao} onChange={e => setTrabalhos(prev => prev.map((tt, ii) => ii === i ? { ...tt, descricao: e.target.value } : tt))} placeholder="Descrição do trabalho..." style={{ flex: 1, border: "none", borderBottom: "1.5px dotted #D4B896", padding: "0.3rem 0", fontFamily: "'Nunito',sans-serif", fontWeight: 500, fontSize: "0.8rem", color: t.done ? "#B0A090" : "#5B3A29", textDecoration: t.done ? "line-through" : "none", background: "transparent", outline: "none" }} />
                <button onClick={() => removeTrabalho(i)} style={{ ...kawaiiBtnStyle, background: "transparent", color: "#BFD8B8", padding: "0.2rem", fontSize: "0.8rem" }}>❌</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/saude")}>← Saúde</button>
          <button className="nav-btn" onClick={() => navigate("/anotacoes-aulas")}>Anotações de Aulas →</button>
        </div>
      </div>
    </div>
  );
}
