/* =============================================================
   PÁGINA: Visão Anual — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import TabSidebar from "@/components/TabSidebar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { AddKawaiiButton, DeleteKawaiiButton } from "@/components/KawaiiListActions";

const GATINHOS_CALENDARIO = "/assets/kawaii/kawaii_calendario.png";

const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
const diasSemana = ["D","S","T","Q","Q","S","S"];

function MiniCalendario({ mes, ano }: { mes: number; ano: number }) {
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < primeiroDia; i++) cells.push(null);
  for (let d = 1; d <= diasNoMes; d++) cells.push(d);

  return (
    <div style={{ background: "#FFFBF3", borderRadius: "1rem", border: "2px solid #E8D5C0", padding: "0.75rem", minWidth: 140 }}>
      <div style={{ fontWeight: 800, color: "#5B3A29", textAlign: "center", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
        {meses[mes]} {ano}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {diasSemana.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: "0.6rem", fontWeight: 700, color: "#A96F45", padding: "2px 0" }}>{d}</div>
        ))}
        {cells.map((cell, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              fontSize: "0.65rem",
              fontWeight: 500,
              color: cell ? "#5B3A29" : "transparent",
              padding: "2px 0",
              borderRadius: "50%",
              background: cell && new Date(ano, mes, cell).getDay() === 0 ? "#F4B7C3" : "transparent",
            }}
          >
            {cell || "."}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlannerAnual() {
  const [, navigate] = useLocation();
  const ano = new Date().getFullYear();
  
  // Todos os estados usam localStorage para persistência automática
  const [datasImportantes, setDatasImportantes] = useLocalStorage('planner_anual_datas', [
    { data: "", evento: "" },
    { data: "", evento: "" },
    { data: "", evento: "" },
    { data: "", evento: "" },
    { data: "", evento: "" },
    { data: "", evento: "" },
  ]);
  const [metasAnuais, setMetasAnuais] = useLocalStorage('planner_anual_metas', ["", "", "", "", ""]);
  const [palavraDoAno, setPalavraDoAno] = useLocalStorage('planner_anual_palavra', "");
  const [intencao, setIntencao] = useLocalStorage('planner_anual_intencao', "");

  const addDataImportante = () => setDatasImportantes(prev => [...prev, { data: "", evento: "" }]);
  const removeDataImportante = (index: number) => setDatasImportantes(prev => prev.filter((_, i) => i !== index));
  const addMetaAnual = () => setMetasAnuais(prev => [...prev, ""]);
  const removeMetaAnual = (index: number) => setMetasAnuais(prev => prev.filter((_, i) => i !== index));

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      {/* Header */}
      <div style={{ background: "#F7D98B", borderBottom: "3px solid #E8C55A", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_CALENDARIO} alt="Gatinhos calendário" style={{ width: 64, height: 64, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.6rem", color: "#5B3A29" }}>📅 Visão Anual {ano}</h1>
              <p style={{ color: "#8B6347", fontSize: "0.85rem", fontWeight: 600 }}>Calendário completo, datas importantes e metas do ano</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/")}>
            ← Índice
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Palavra do ano */}
        <div className="planner-card" style={{ padding: "1.25rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="field-label" style={{ marginBottom: "0.4rem" }}>✨ Minha Palavra do Ano</div>
            <input
              value={palavraDoAno}
              onChange={e => setPalavraDoAno(e.target.value)}
              placeholder="Ex: Foco, Crescimento, Coragem..."
              style={{
                width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem",
                padding: "0.6rem 0.9rem", fontFamily: "'Nunito', sans-serif",
                fontWeight: 800, fontSize: "1.1rem", color: "#5B3A29", background: "#FFFBF3",
                outline: "none",
              }}
            />
          </div>
          <div style={{ flex: 2, minWidth: 260 }}>
            <div className="field-label" style={{ marginBottom: "0.4rem" }}>💭 Minha Intenção para {ano}</div>
            <textarea
              value={intencao}
              onChange={e => setIntencao(e.target.value)}
              placeholder="O que você quer sentir, conquistar e viver neste ano?"
              rows={3}
              style={{
                width: "100%", border: "2px solid #E8D5C0", borderRadius: "0.75rem",
                padding: "0.6rem 0.9rem", fontFamily: "'Nunito', sans-serif",
                fontWeight: 500, fontSize: "0.88rem", color: "#5B3A29", background: "#FFFBF3",
                outline: "none", resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* Calendários anuais */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ width: 4, height: 22, background: "#F7D98B", borderRadius: 4 }} />
            <h2 className="section-title" style={{ fontSize: "1.1rem" }}>Calendário {ano}</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(145px, 1fr))", gap: "0.75rem" }}>
            {meses.map((_, i) => (
              <MiniCalendario key={i} mes={i} ano={ano} />
            ))}
          </div>
        </div>

        {/* Datas importantes */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 4, height: 22, background: "#F4B7C3", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1.1rem" }}>Datas Importantes</h2>
            </div>
            <AddKawaiiButton onClick={addDataImportante} title="Incluir data importante" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {datasImportantes.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <span style={{ fontSize: "1rem", flexShrink: 0 }}>📌</span>
                <input
                  value={item.data}
                  onChange={e => {
                    const novo = [...datasImportantes];
                    novo[i] = { ...novo[i], data: e.target.value };
                    setDatasImportantes(novo);
                  }}
                  placeholder="DD/MM"
                  style={{
                    width: 70, border: "2px solid #E8D5C0", borderRadius: "0.6rem",
                    padding: "0.4rem 0.6rem", fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700, fontSize: "0.85rem", color: "#5B3A29", background: "#FFFBF3",
                    outline: "none", textAlign: "center",
                  }}
                />
                <input
                  value={item.evento}
                  onChange={e => {
                    const novo = [...datasImportantes];
                    novo[i] = { ...novo[i], evento: e.target.value };
                    setDatasImportantes(novo);
                  }}
                  placeholder="Descreva o evento ou data especial..."
                  style={{
                    flex: 1, border: "none", borderBottom: "2px dotted #D4B896",
                    padding: "0.4rem 0.2rem", fontFamily: "'Nunito', sans-serif",
                    fontWeight: 500, fontSize: "0.88rem", color: "#5B3A29", background: "transparent",
                    outline: "none",
                  }}
                />
                <DeleteKawaiiButton onClick={() => removeDataImportante(i)} title="Excluir data importante" />
              </div>
            ))}
          </div>
        </div>

        {/* Metas anuais */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 4, height: 22, background: "#BFD8B8", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1.1rem" }}>🌟 Minhas Metas do Ano</h2>
            </div>
            <AddKawaiiButton onClick={addMetaAnual} title="Incluir meta anual" />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {metasAnuais.map((meta, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "#F7D98B",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: "0.85rem", color: "#5B3A29", flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <input
                  value={meta}
                  onChange={e => {
                    const novas = [...metasAnuais];
                    novas[i] = e.target.value;
                    setMetasAnuais(novas);
                  }}
                  placeholder={`Meta ${i + 1} — escreva aqui...`}
                  style={{
                    flex: 1, border: "none", borderBottom: "2px dotted #D4B896",
                    padding: "0.4rem 0.2rem", fontFamily: "'Nunito', sans-serif",
                    fontWeight: 600, fontSize: "0.9rem", color: "#5B3A29", background: "transparent",
                    outline: "none",
                  }}
                />
                <DeleteKawaiiButton onClick={() => removeMetaAnual(i)} title="Excluir meta anual" />
              </div>
            ))}
          </div>
        </div>

        {/* Navegação */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/")}>
            ← Índice
          </button>
          <button className="nav-btn" onClick={() => navigate("/planner-mensal")}>
            Planner Mensal →
          </button>
        </div>
      </div>
    </div>
  );
}
