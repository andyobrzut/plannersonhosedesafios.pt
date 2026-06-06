/* =============================================================
   PÁGINA: Controle Financeiro — Planner Gatinho Cosmico
   ============================================================= */

import { useLocation } from "wouter";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TabSidebar from "@/components/TabSidebar";

const GATINHOS_FINANCAS = "/assets/kawaii/kawaii_financas.png";

interface Transacao {
  data: string;
  descricao: string;
  categoria: string;
  valor: string;
  tipo: "receita" | "despesa";
}

const categoriasDespesa = ["🏠 Moradia","🍔 Alimentação","🚌 Transporte","📚 Educação","🏥 Saúde","👗 Roupas","🎮 Lazer","💡 Contas","📱 Assinaturas","💰 Poupança","Outros"];
const categoriasReceita = ["💼 Salário","🎓 Bolsa","💻 Freelance","🎁 Presente","💰 Investimento","Outros"];

export default function ControleFinanceiro() {
  const [, navigate] = useLocation();
  const [mes, setMes] = useLocalStorage('planner_controlefinanceiro_mes', "Junho 2025");
  const [orcamento, setOrcamento] = useLocalStorage('planner_controlefinanceiro_orcamento', "");
  const [metaPoupanca, setMetaPoupanca] = useLocalStorage('planner_controlefinanceiro_metapoupanca', "");
  const [transacoes, setTransacoes] = useLocalStorage<Transacao[]>('planner_controlefinanceiro_transacoes', [
    { data: "", descricao: "", categoria: "🍔 Alimentação", valor: "", tipo: "despesa" },
    { data: "", descricao: "", categoria: "💼 Salário", valor: "", tipo: "receita" },
  ]);
  const [notas, setNotas] = useLocalStorage('planner_controlefinanceiro_notas', "");

  const totalReceitas = transacoes.filter(t => t.tipo === "receita").reduce((acc, t) => acc + (parseFloat(t.valor.replace(",",".")) || 0), 0);
  const totalDespesas = transacoes.filter(t => t.tipo === "despesa").reduce((acc, t) => acc + (parseFloat(t.valor.replace(",",".")) || 0), 0);
  const saldo = totalReceitas - totalDespesas;

  const addTransacao = (tipo: "receita" | "despesa") => {
    setTransacoes(prev => [...prev, { data: "", descricao: "", categoria: tipo === "despesa" ? "🍔 Alimentação" : "💼 Salário", valor: "", tipo }]);
  };

  const updateTransacao = (i: number, field: keyof Transacao, value: string) => {
    setTransacoes(prev => prev.map((t, ii) => ii === i ? { ...t, [field]: value } : t));
  };

  const removeTransacao = (i: number) => {
    setTransacoes(prev => prev.filter((_, ii) => ii !== i));
  };

  const kawaiiBtnStyle = {
    border: "none",
    borderRadius: "0.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    fontSize: "0.9rem",
    padding: "0.3rem"
  };

  return (
    <div className="planner-page" style={{ minHeight: "100vh", background: "#FFF7EA" }}>
      <TabSidebar />

      <div style={{ background: "#B9DDE7", borderBottom: "3px solid #7BB8C8", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={GATINHOS_FINANCAS} alt="Gatinhos finanças" style={{ width: 60, height: 60, objectFit: "contain" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem", color: "#2A5A6A" }}>💰 Controle Financeiro</h1>
              <p style={{ color: "#3A7A8A", fontSize: "0.85rem", fontWeight: 600 }}>Cuide do seu dinheiro com carinho e organização</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" style={{ color: "#2A5A6A", borderColor: "#2A5A6A" }} onClick={() => navigate("/")}>← Índice</button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "1.5rem auto 2rem", padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Resumo do mês */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          {[
            { label: "💚 Total Receitas", value: `R$ ${totalReceitas.toFixed(2).replace(".",",")}`, bg: "#BFD8B8", color: "#3D5C3A" },
            { label: "❤️ Total Despesas", value: `R$ ${totalDespesas.toFixed(2).replace(".",",")}`, bg: "#F4B7C3", color: "#7A2D3E" },
            { label: saldo >= 0 ? "💙 Saldo Positivo" : "⚠️ Saldo Negativo", value: `R$ ${Math.abs(saldo).toFixed(2).replace(".",",")}`, bg: saldo >= 0 ? "#B9DDE7" : "#F4B7C3", color: saldo >= 0 ? "#2A5A6A" : "#7A2D3E" },
          ].map((card, i) => (
            <div key={i} className="planner-card" style={{ padding: "1rem", background: card.bg, border: "none" }}>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.75rem", color: card.color, marginBottom: "0.3rem" }}>{card.label}</div>
              <div style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 900, fontSize: "1.4rem", color: card.color }}>{card.value}</div>
            </div>
          ))}
        </div>

        {/* Orçamento e meta */}
        <div className="planner-card" style={{ padding: "1.25rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>📅 Mês</div>
            <input value={mes} onChange={e => setMes(e.target.value)} style={{ border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }} />
          </div>
          <div>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>💰 Orçamento do Mês (R$)</div>
            <input value={orcamento} onChange={e => setOrcamento(e.target.value)} placeholder="0,00" style={{ border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }} />
          </div>
          <div>
            <div className="field-label" style={{ marginBottom: "0.3rem" }}>🐷 Meta de Poupança (R$)</div>
            <input value={metaPoupanca} onChange={e => setMetaPoupanca(e.target.value)} placeholder="0,00" style={{ border: "2px solid #E8D5C0", borderRadius: "0.75rem", padding: "0.5rem 0.9rem", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.9rem", color: "#5B3A29", background: "#FFFBF3", outline: "none" }} />
          </div>
          {orcamento && (
            <div style={{ flex: 1, minWidth: 200 }}>
              <div className="field-label" style={{ marginBottom: "0.3rem" }}>Uso do Orçamento</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min(100, (totalDespesas / (parseFloat(orcamento.replace(",",".")) || 1)) * 100)}%`, background: totalDespesas > parseFloat(orcamento.replace(",",".")) ? "#E8899A" : "linear-gradient(90deg, #A96F45, #C4854A)" }} />
              </div>
              <div style={{ fontSize: "0.75rem", color: "#8B6347", fontWeight: 600, marginTop: "0.3rem" }}>
                {((totalDespesas / (parseFloat(orcamento.replace(",",".")) || 1)) * 100).toFixed(0)}% utilizado
              </div>
            </div>
          )}
        </div>

        {/* Lançamentos */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ width: 4, height: 22, background: "#B9DDE7", borderRadius: 4 }} />
              <h2 className="section-title" style={{ fontSize: "1.1rem" }}>Lançamentos do Mês</h2>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="nav-btn" style={{ background: "#BFD8B8", color: "#3D5C3A", fontSize: "0.78rem", padding: "0.3rem 0.75rem" }} onClick={() => addTransacao("receita")}>+ Receita</button>
              <button className="nav-btn" style={{ background: "#F4B7C3", color: "#7A2D3E", fontSize: "0.78rem", padding: "0.3rem 0.75rem" }} onClick={() => addTransacao("despesa")}>+ Despesa</button>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E8D5C0" }}>
                  {["Data","Descrição","Categoria","Valor (R$)","Tipo",""].map(h => (
                    <th key={h} style={{ textAlign: "left", fontFamily: "'Nunito',sans-serif", fontWeight: 800, fontSize: "0.75rem", color: "#8B6347", padding: "0.4rem 0.5rem" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transacoes.map((t, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F0E4D0" }}>
                    <td style={{ padding: "0.4rem 0.5rem" }}>
                      <input value={t.data} onChange={e => updateTransacao(i, "data", e.target.value)} placeholder="DD/MM" style={{ width: 60, border: "none", borderBottom: "1.5px dotted #D4B896", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.8rem", color: "#5B3A29", background: "transparent", outline: "none" }} />
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem" }}>
                      <input value={t.descricao} onChange={e => updateTransacao(i, "descricao", e.target.value)} placeholder="Descrição..." style={{ width: "100%", minWidth: 120, border: "none", borderBottom: "1.5px dotted #D4B896", fontFamily: "'Nunito',sans-serif", fontWeight: 500, fontSize: "0.8rem", color: "#5B3A29", background: "transparent", outline: "none" }} />
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem" }}>
                      <select value={t.categoria} onChange={e => updateTransacao(i, "categoria", e.target.value)} style={{ border: "none", fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "0.78rem", color: "#5B3A29", background: "transparent", outline: "none" }}>
                        {(t.tipo === "despesa" ? categoriasDespesa : categoriasReceita).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem" }}>
                      <input value={t.valor} onChange={e => updateTransacao(i, "valor", e.target.value)} placeholder="0,00" style={{ width: 80, border: "none", borderBottom: "1.5px dotted #D4B896", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "0.85rem", color: t.tipo === "receita" ? "#3D5C3A" : "#7A2D3E", background: "transparent", outline: "none", textAlign: "right" }} />
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem" }}>
                      <span style={{ background: t.tipo === "receita" ? "#BFD8B8" : "#F4B7C3", color: t.tipo === "receita" ? "#3D5C3A" : "#7A2D3E", borderRadius: "999px", padding: "0.15rem 0.6rem", fontSize: "0.72rem", fontWeight: 700 }}>
                        {t.tipo === "receita" ? "Receita" : "Despesa"}
                      </span>
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem" }}>
                      <button onClick={() => removeTransacao(i)} style={{ ...kawaiiBtnStyle, background: "transparent", color: "#F4B7C3" }} title="Excluir lançamento">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notas financeiras */}
        <div className="planner-card" style={{ padding: "1.25rem" }}>
          <div className="field-label" style={{ marginBottom: "0.5rem" }}>📝 Observações Financeiras</div>
          <textarea value={notas} onChange={e => setNotas(e.target.value)} placeholder="Metas financeiras, lembretes de pagamentos, planos de economia..." rows={3} style={{ width:"100%", border:"2px solid #E8D5C0", borderRadius:"0.75rem", padding:"0.6rem 0.9rem", fontFamily:"'Nunito',sans-serif", fontWeight:500, fontSize:"0.85rem", color:"#5B3A29", background:"#FFFBF3", outline:"none", resize:"vertical" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button className="nav-btn nav-btn-outline" style={{ color: "#5B3A29", borderColor: "#5B3A29" }} onClick={() => navigate("/habitos")}>← Hábitos</button>
          <button className="nav-btn" onClick={() => navigate("/saude")}>Saúde & Bem-Estar →</button>
        </div>
      </div>
    </div>
  );
}
