import { useLocation } from "wouter";

const tabs = [
  { label: "Inicio", icon: "☕", path: "/", color: "#DFA69A" },
  { label: "Ano", icon: "✦", path: "/planner-anual", color: "#E8C99B" },
  { label: "Mes", icon: "◷", path: "/planner-mensal", color: "#CFA783" },
  { label: "Semana", icon: "▦", path: "/planner-semanal", color: "#A9B79F" },
  { label: "Dia", icon: "☀", path: "/planner-diario", color: "#E7BBAE" },
  { label: "Sonhos", icon: "★", path: "/metas-objetivos", color: "#D7B995" },
  { label: "Habitos", icon: "✓", path: "/habitos", color: "#B7C2A9" },
  { label: "Financas", icon: "$", path: "/financeiro", color: "#C99B73" },
  { label: "Bem-estar", icon: "♡", path: "/saude", color: "#DFA69A" },
  { label: "Estudos", icon: "✎", path: "/academico", color: "#E8C99B" },
  { label: "Aulas", icon: "☕", path: "/anotacoes-aulas", color: "#CFA783" },
  { label: "Projetos", icon: "↗", path: "/projetos", color: "#A9B79F" },
  { label: "Ideias", icon: "✧", path: "/notas", color: "#E7BBAE" },
  { label: "Historico", icon: "↺", path: "/historico", color: "#D7B995" },
];

export default function TabSidebar() {
  const [location, navigate] = useLocation();

  return (
    <nav className="tab-sidebar no-print" aria-label="Navegacao do planner">
      {tabs.map((tab) => {
        const active = location === tab.path;
        return (
          <button
            key={tab.path}
            className={`tab-btn ${active ? "active" : ""}`}
            style={{ background: tab.color }}
            onClick={() => navigate(tab.path)}
            title={tab.label}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
