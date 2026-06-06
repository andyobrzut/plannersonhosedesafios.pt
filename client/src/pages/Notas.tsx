/* =============================================================
   PÁGINA: Notas Livres — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";
import { AddKawaiiButton, DeleteKawaiiButton } from "@/components/KawaiiListActions";

const GATINHOS_NOTAS = "/assets/kawaii/kawaii_notas.png";

interface Nota {
  titulo: string;
  conteudo: string;
  cor: string;
  data: string;
}

const cores = ["#FFF7EA","#F4B7C3","#B9DDE7","#BFD8B8","#F7D98B","#F5EDE0"];
const coresBorda = ["#E8D5C0","#E8899A","#7BB8C8","#7BA87A","#E8C55A","#D4B896"];

export default function Notas() {
  const [, navigate] = useLocation();
  const [notas, setNotas] = useLocalStorage<Nota[]>('planner_notas_notas', [
    { titulo: "Ideias & Inspirações", conteudo: "", cor: "#F7D98B", data: "" },
    { titulo: "Lista de Leituras", conteudo: "", cor: "#BFD8B8", data: "" },
    { titulo: "Coisas para Pesquisar", conteudo: "", cor: "#B9DDE7", data: "" },
    { titulo: "Reflexões Pessoais", conteudo: "", cor: "#F4B7C3", data: "" },
  ]);
  const [notaAtiva, setNotaAtiva] = useLocalStorage('planner_notas_notaativa', 0);
  const [listaRapida, setListaRapida] = useLocalStorage('planner_notas_listarapida', [{done:false,texto:""},{done:false,texto:""},{done:false,texto:""},{done:false,texto:""},{done:false,texto:""}]);
  const [citacao, setCitacao] = useLocalStorage('planner_notas_citacao', "");
  const [autor, setAutor] = useLocalStorage('planner_notas_autor', "");

  const n = notas[notaAtiva];

  const updateNota = (field: keyof Nota, value: string) => {
    setNotas(prev => prev.map((nn, i) => i === notaAtiva ? { ...nn, [field]: value } : nn));
  };

  const addNota = () => {
    const corIdx = notas.length % cores.length;
    setNotas(prev => [...prev, { titulo: `Nota ${prev.length + 1}`, conteudo: "", cor: cores[corIdx], data: "" }]);
    setNotaAtiva(notas.length);
  };

  const removeNota = (index: number) => {
    setNotas(prev => prev.length <= 1 ? prev : prev.filter((_, i) => i !== index));
    if (notaAtiva >= index && notaAtiva > 0) setNotaAtiva(notaAtiva - 1);
  };

  const addItemListaRapida = () => setListaRapida(prev => [...prev, { done: false, texto: "" }]);
  const removeItemListaRapida = (index: number) => setListaRapida(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      <div style={{ background: "#F4B7C3", borderBottom: "3px solid #E8899A", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_NOTAS} alt="Gatinhos notas" style={{ width: 60, height: 60, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#7A2D3E" }}>💭 Notas Livres</h1>
              <p style={{ color: "#9A4D5E", fontSize: "0.85rem", fontWeight: 600 }}>Seu espaço criativo para ideias, listas e reflexões</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#7A2D3E", borderColor: "#7A2D3E" }} onClick={() => navigate("/")}>← Índice</button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", gap: "1.25rem" }}>

        {/* Lista de notas */}
        <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div className="field-label" style={{ marginBottom: "0.25rem" }}>Minhas Notas</div>
          {notas.map((nota, i) => (
            <div key={i} style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
            <button
              onClick={() => setNotaAtiva(i)}
              style={{
                background: i === notaAtiva ? nota.cor : "#FFFBF3",
                border: `2px solid ${i === notaAtiva ? coresBorda[cores.indexOf(nota.cor)] || "#E8D5C0" : "#E8D5C0"}`,
                borderRadius: "0.75rem",
                padding: "0.6rem 0.75rem",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.82rem", color: "#5B3A29" }}>
                {nota.titulo}
              </div>
              {nota.data && (
                <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 500, fontSize: "0.68rem", color: "#8B6347", marginTop: "0.1rem" }}>
                  {nota.data}
                </div>
              )}
            </button>
            <DeleteKawaiiButton onClick={() => removeNota(i)} title="Excluir nota" />
            </div>
          ))}
          <button className="nav-btn" style={{ fontSize: "0.78rem", padding: "0.4rem 0.75rem", marginTop: "0.25rem" }} onClick={addNota}>
            + Nova Nota
          </button>
        </div>

        {/* Editor de nota */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Cabeçalho */}
          <div className="planner-card" style={{ padding: "1.25rem", background: n.cor, border: `2px solid ${coresBorda[cores.indexOf(n.cor)] || "#E8D5C0"}` }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
              <input
                value={n.titulo}
                onChange={e => updateNota("titulo", e.target.value)}
                style={{ flex: 1, border: "none", borderBottom: "2px solid rgba(91,58,41,0.3)", fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "1.2rem", color: "#5B3A29", background: "transparent", outline: "none", padding: "0.2rem 0" }}
              />
              <input
                value={n.data}
                onChange={e => updateNota("data", e.target.value)}
                placeholder="DD/MM/AAAA"
                style={{ width: 110, border: "2px solid rgba(91,58,41,0.2)", borderRadius: "0.6rem", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#5B3A29", background: "rgba(255,255,255,0.5)", outline: "none", padding: "0.3rem 0.5rem" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {cores.map((c, i) => (
                <button
                  key={i}
                  onClick={() => updateNota("cor", c)}
                  style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: c, border: `2px solid ${n.cor === c ? "#5B3A29" : "#E8D5C0"}`,
                    cursor: "pointer", transition: "all 0.12s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Conteúdo da nota */}
          <div className="planner-card" style={{ padding: "1.25rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div style={{ width: 4, height: 22, background: "#F4B7C3", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1rem" }}>✏️ Conteúdo</h2>
            </div>
            <textarea
              value={n.conteudo}
              onChange={e => updateNota("conteudo", e.target.value)}
              placeholder="Escreva livremente aqui... ideias, reflexões, listas, planos, sonhos, pensamentos..."
              rows={10}
              style={{ width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.75rem 1rem", fontFamily: "'Nunito',sans-serif", fontWeight: 500, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none", resize: "vertical", lineHeight: 1.9 }}
            />
          </div>

          {/* Lista rápida + citação */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="planner-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: 4, height: 22, background: "#F7D98B", borderRadius: 4 }} />
                  <h2 className="section-title" style={{ fontSize: "1rem" }}>📋 Lista Rápida</h2>
                </div>
                <AddKawaiiButton onClick={addItemListaRapida} title="Incluir item na lista" />
              </div>
              {listaRapida.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div className={`habit-check ${item.done ? "checked" : ""}`} onClick={() => setListaRapida(prev => prev.map((ll, ii) => ii === i ? { ...ll, done: !ll.done } : ll))}>
                    {item.done && <span style={{ fontSize: "0.7rem" }}>✓</span>}
                  </div>
                  <input
                    value={item.texto}
                    onChange={e => setListaRapida(prev => prev.map((ll, ii) => ii === i ? { ...ll, texto: e.target.value } : ll))}
                    placeholder="Item da lista..."
                    style={{ flex:1, border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.3rem 0", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.85rem", color: item.done ? "#B0A090" : "#5B3A29", textDecoration: item.done ? "line-through" : "none", background:"transparent", outline:"none" }}
                  />
                  <DeleteKawaiiButton onClick={() => removeItemListaRapida(i)} title="Excluir item da lista" />
                </div>
              ))}
            </div>

            <div className="planner-card" style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 4, height: 22, background: "#BFD8B8", borderRadius: 4 }} />
                <h2 className="section-title" style={{ fontSize: "1rem" }}>💬 Citação Favorita</h2>
              </div>
              <textarea
                value={citacao}
                onChange={e => setCitacao(e.target.value)}
                placeholder="Anote uma citação que te inspira..."
                rows={4}
                style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.6rem 0.9rem", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.88rem", color:"#5B3A29", background:"#FFFBF3", outline:"none", resize:"vertical", fontStyle:"italic" }}
              />
              <input
                value={autor}
                onChange={e => setAutor(e.target.value)}
                placeholder="— Autor"
                style={{ width:"100%", border:"none", borderBottom:"1.5px dotted #D4B896", padding:"0.4rem 0.2rem", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"0.82rem", color:"#A96F45", background:"transparent", outline:"none", marginTop:"0.4rem" }}
              />

              {/* Recado do Gatinho */}
              <div style={{ marginTop: "1rem", padding: "0.75rem", background: "linear-gradient(135deg, #F5EDE0, #FFF0D8)", borderRadius: "0.75rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>🐱</span>
                <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "#8B6347", lineHeight: 1.5 }}>
                  Seu cantinho cósmico também pode ser tranquilo. respire fundo, anote seus pensamentos e vá com calma. 🌿
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/projetos")}>← Projetos</button>
            <button className="nav-btn" onClick={() => navigate("/")}>🏠 Voltar ao Início</button>
          </div>
        </div>
      </div>
    </div>
  );
}
