import { useState } from "react";
import { useLocation } from "wouter";
import TabSidebar from "@/components/TabSidebar";
import {
  clearCurrentPlanner,
  deletePlannerPeriod,
  getPlannerHistory,
  PlannerPeriod,
  restorePlannerPeriod,
  savePlannerPeriod,
} from "@/lib/plannerHistory";

const banner = "/assets/cosmic/cosmic-kitty-banner.png";

function suggestedName() {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
    .format(new Date())
    .replace(/^./, letter => letter.toUpperCase());
}

export default function Historico() {
  const [, navigate] = useLocation();
  const [name, setName] = useState(suggestedName);
  const [history, setHistory] = useState<PlannerPeriod[]>(getPlannerHistory);
  const [message, setMessage] = useState("");

  const save = (startNew: boolean) => {
    if (!name.trim()) {
      setMessage("Digite um nome para identificar este período.");
      return;
    }
    setHistory(savePlannerPeriod(name));
    if (startNew) {
      clearCurrentPlanner();
      window.location.href = "/";
      return;
    }
    setMessage(`Cópia de "${name.trim()}" salva no histórico.`);
  };

  const restore = (period: PlannerPeriod) => {
    if (!window.confirm(`Restaurar "${period.name}"? Os dados atuais serão substituídos.`)) return;
    restorePlannerPeriod(period);
    window.location.href = "/";
  };

  const remove = (period: PlannerPeriod) => {
    if (!window.confirm(`Excluir definitivamente "${period.name}"?`)) return;
    setHistory(deletePlannerPeriod(period.id));
  };

  return (
    <div className="planner-page history-page" style={{ minHeight: "100vh" }}>
      <TabSidebar />
      <div style={{ background: "#EEE9FB", borderBottom: "3px solid #B39DDB", padding: "1.25rem 2rem" }}>
        <div style={{ maxWidth: 1050, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <img src={banner} alt="Gatinhos organizando o histórico" style={{ width: 76, height: 64, objectFit: "cover" }} />
            <div>
              <h1 className="section-title" style={{ fontSize: "1.5rem" }}>Histórico de Períodos</h1>
              <p style={{ color: "#6F638F", fontSize: "0.85rem", fontWeight: 600 }}>Guarde meses antigos e comece páginas novas sem perder nada</p>
            </div>
          </div>
          <button className="nav-btn nav-btn-outline" onClick={() => navigate("/")}>← Índice</button>
        </div>
      </div>

      <main className="history-content">
        <section className="planner-card history-save-card">
          <div>
            <div className="field-label">Nome do período</div>
            <input value={name} onChange={event => setName(event.target.value)} placeholder="Ex: Junho 2026" />
            {message && <p className="history-message">{message}</p>}
          </div>
          <div className="history-actions">
            <button className="nav-btn nav-btn-outline" onClick={() => save(false)}>Salvar cópia</button>
            <button className="nav-btn" onClick={() => save(true)}>Salvar e iniciar novo</button>
          </div>
        </section>

        <section>
          <div className="history-heading">
            <h2 className="section-title">Períodos salvos</h2>
            <span>{history.length}</span>
          </div>
          {history.length === 0 ? (
            <div className="planner-card history-empty">
              <strong>Nenhum período salvo ainda.</strong>
              <span>Quando terminar um mês, salve uma cópia aqui antes de iniciar o próximo.</span>
            </div>
          ) : (
            <div className="history-list">
              {history.map(period => (
                <article className="planner-card history-item" key={period.id}>
                  <div>
                    <h3>{period.name}</h3>
                    <p>Salvo em {new Date(period.createdAt).toLocaleString("pt-BR")}</p>
                    <span>{Object.keys(period.data).length} conjuntos de dados guardados</span>
                  </div>
                  <div className="history-item-actions">
                    <button className="nav-btn nav-btn-outline" onClick={() => restore(period)}>Restaurar</button>
                    <button className="history-delete" onClick={() => remove(period)}>Excluir</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
