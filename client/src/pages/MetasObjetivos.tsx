/* =============================================================
   PÁGINA: Metas & Objetivos — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";
import { AddKawaiiButton, DeleteKawaiiButton } from "@/components/KawaiiListActions";

const GATINHOS_METAS = "/assets/kawaii/kawaii_metas.png";

const categorias = ["📚 Estudos","💼 Carreira","💰 Finanças","🌿 Saúde","👨‍👩‍👧 Família","❤️ Relacionamentos","🎨 Hobbies","✈️ Viagens"];

interface Meta {
  titulo: string;
  categoria: string;
  prazo: string;
  progresso: number;
  passos: string[];
  concluida: boolean;
}

export default function MetasObjetivos() {
  const [, navigate] = useLocation();
  const [metas, setMetas] = useLocalStorage<Meta[]>('planner_metasobjetivos_metas', [
    { titulo: "", categoria: "📚 Estudos", prazo: "", progresso: 0, passos: ["","",""], concluida: false },
    { titulo: "", categoria: "💼 Carreira", prazo: "", progresso: 0, passos: ["","",""], concluida: false },
    { titulo: "", categoria: "🌿 Saúde", prazo: "", progresso: 0, passos: ["","",""], concluida: false },
  ]);
  const [sonhos, setSonhos] = useLocalStorage('planner_metasobjetivos_sonhos', ["","","","",""]);
  const [visaoFuturo, setVisaoFuturo] = useLocalStorage('planner_metasobjetivos_visaofuturo', "");

  const updateMeta = (i: number, field: keyof Meta, value: unknown) => {
    setMetas(prev => prev.map((m, ii) => ii === i ? { ...m, [field]: value } : m));
  };

  const updatePasso = (mi: number, pi: number, value: string) => {
    setMetas(prev => prev.map((m, ii) => ii === mi ? { ...m, passos: m.passos.map((p, pii) => pii === pi ? value : p) } : m));
  };

  const addSonho = () => setSonhos(prev => [...prev, ""]);
  const removeSonho = (index: number) => setSonhos(prev => prev.filter((_, i) => i !== index));
  const addMeta = () => setMetas(prev => [...prev, { titulo: "", categoria: "📚 Estudos", prazo: "", progresso: 0, passos: ["", "", ""], concluida: false }]);
  const removeMeta = (index: number) => setMetas(prev => prev.filter((_, i) => i !== index));
  const addPasso = (metaIndex: number) => setMetas(prev => prev.map((m, i) => i === metaIndex ? { ...m, passos: [...m.passos, ""] } : m));
  const removePasso = (metaIndex: number, passoIndex: number) => setMetas(prev => prev.map((m, i) => i === metaIndex ? { ...m, passos: m.passos.filter((_, pi) => pi !== passoIndex) } : m));

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      {/* Header */}
      <div style={{ background: "#F7D98B", borderBottom: "3px solid #E8C55A", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_METAS} alt="Gatinhos metas" style={{ width: 64, height: 64, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#5B3A29" }}>🌟 Metas & Objetivos</h1>
              <p style={{ color: "#8B6347", fontSize: "0.85rem", fontWeight: 600 }}>Defina, planeje e conquiste seus sonhos</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/")}>
            ← Índice
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Visão de futuro */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 4, height: 22, background: "#F7D98B", borderRadius: 4 }} />
            <h2 className="section-title" style={{ fontSize: "1.1rem" }}>🔭 Minha Visão de Futuro</h2>
          </div>
          <textarea
            value={visaoFuturo}
            onChange={e => setVisaoFuturo(e.target.value)}
            placeholder="Como você se imagina daqui a 5 anos? O que estará fazendo? Como estará se sentindo? Descreva com detalhes..."
            rows={4}
            style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.75rem 1rem", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.9rem", color:"#5B3A29", background:"#FFFBF3", outline:"none", resize:"vertical" }}
          />
        </div>

        {/* Lista de sonhos */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 4, height: 22, background: "#F4B7C3", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1.1rem" }}>💭 Lista de Sonhos</h2>
            </div>
            <AddKawaiiButton onClick={addSonho} title="Incluir sonho" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {sonhos.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ fontSize: "1.1rem" }}>🌙</span>
                <input
                  value={s}
                  onChange={e => { const n=[...sonhos]; n[i]=e.target.value; setSonhos(n); }}
                  placeholder={`Sonho ${i+1} — o que você quer viver, ser ou ter?`}
                  style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.4rem 0.2rem", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.88rem", color:"#5B3A29", background:"transparent", outline:"none" }}
                />
                <DeleteKawaiiButton onClick={() => removeSonho(i)} title="Excluir sonho" />
              </div>
            ))}
          </div>
        </div>

        {/* Metas detalhadas */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "-0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 4, height: 22, background: "#BFD8B8", borderRadius: 4 }} />
            <h2 className="section-title" style={{ fontSize: "1.1rem" }}>🎯 Metas com Plano de Ação</h2>
          </div>
          <AddKawaiiButton onClick={addMeta} title="Incluir meta" />
        </div>

        {metas.map((meta, mi) => (
          <div key={mi} className="planner-card" style={{ padding: "1.25rem", position: "relative" }}>
            <div style={{ position: "absolute", right: 12, top: 12 }}>
              <DeleteKawaiiButton onClick={() => removeMeta(mi)} title="Excluir meta" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 160px 120px", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div>
                <div className="field-label" style={{ marginBottom: "0.3rem" }}>🎯 Meta {mi + 1}</div>
                <input
                  value={meta.titulo}
                  onChange={e => updateMeta(mi, "titulo", e.target.value)}
                  placeholder="Descreva sua meta de forma clara e específica..."
                  style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.5rem 0.9rem", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"0.9rem", color:"#5B3A29", background:"#FFFBF3", outline:"none" }}
                />
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: "0.3rem" }}>Categoria</div>
                <select
                  value={meta.categoria}
                  onChange={e => updateMeta(mi, "categoria", e.target.value)}
                  style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.5rem 0.6rem", fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.8rem", color:"#5B3A29", background:"#FFFBF3", outline:"none" }}
                >
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <div className="field-label" style={{ marginBottom: "0.3rem" }}>Prazo</div>
                <input
                  value={meta.prazo}
                  onChange={e => updateMeta(mi, "prazo", e.target.value)}
                  placeholder="DD/MM/AAAA"
                  style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.5rem 0.6rem", fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.8rem", color:"#5B3A29", background:"#FFFBF3", outline:"none" }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "0.75rem" }}>
              <div className="field-label" style={{ marginBottom: "0.4rem" }}>Progresso: {meta.progresso}%</div>
              <input
                type="range" min={0} max={100} value={meta.progresso}
                onChange={e => updateMeta(mi, "progresso", Number(e.target.value))}
                style={{ width: "100%", accentColor: "#A96F45" }}
              />
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${meta.progresso}%` }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <div className="field-label">📋 Passos para Alcançar</div>
                <AddKawaiiButton onClick={() => addPasso(mi)} title="Incluir passo" />
              </div>
              {meta.passos.map((p, pi) => (
                <div key={pi} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.35rem" }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#BFD8B8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.7rem", color: "#3D5C3A", flexShrink: 0 }}>{pi+1}</div>
                  <input
                    value={p}
                    onChange={e => updatePasso(mi, pi, e.target.value)}
                    placeholder={`Passo ${pi+1}...`}
                    style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.85rem", color:"#5B3A29", background:"transparent", outline:"none" }}
                  />
                  <DeleteKawaiiButton onClick={() => removePasso(mi, pi)} title="Excluir passo" />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Navegação */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/planner-diario")}>
            ← Planner Diário
          </button>
          <button className="nav-btn" onClick={() => navigate("/habitos")}>
            Rastreador de Hábitos →
          </button>
        </div>
      </div>
    </div>
  );
}
