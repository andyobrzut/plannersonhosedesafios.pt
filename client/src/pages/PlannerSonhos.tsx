import { useMemo, useState } from "react";
import {
  Award,
  CalendarCheck,
  Check,
  ChevronRight,
  CircleDollarSign,
  Coffee,
  Edit3,
  Flag,
  Gift,
  Heart,
  Home,
  Lightbulb,
  Plus,
  PiggyBank,
  Plane,
  Sparkles,
  Star,
  Target,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import "@/dreams-theme.css";

type View = "inicio" | "sonhos" | "cofrinhos" | "desafios" | "conquistas";
type DreamCategory = "Viagem" | "Casa" | "Compra" | "Experiência" | "Pessoal";

interface Dream {
  id: string;
  title: string;
  category: DreamCategory;
  target: number;
  saved: number;
  deadline: string;
  why: string;
  color: string;
  deposits?: DreamDeposit[];
}

interface DreamDeposit {
  id: string;
  amount: number;
  date: string;
  note: string;
}

interface Challenge {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  steps: number;
  completed: number[];
  kind: "coffee" | "calendar" | "emergency" | "weekly";
  color: string;
}

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const initialDreams: Dream[] = [
  { id: "dream-1", title: "Ver o pôr do sol em Lisboa", category: "Viagem", target: 12000, saved: 4350, deadline: "2027-05-01", why: "Criar memórias novas e conhecer um lugar que sempre sonhei.", color: "#c48658" },
  { id: "dream-2", title: "Meu cantinho de leitura", category: "Casa", target: 2800, saved: 1680, deadline: "2026-11-01", why: "Ter um espaço calmo para ler, descansar e tomar café.", color: "#9dad91" },
  { id: "dream-3", title: "Curso de fotografia", category: "Pessoal", target: 1800, saved: 720, deadline: "2026-09-01", why: "Investir na minha criatividade e aprender algo que amo.", color: "#dfa69a" },
];

const initialChallenges: Challenge[] = [
  { id: "challenge-1", title: "52 semanas", subtitle: "Um pequeno depósito por semana", amount: 1378, steps: 52, completed: [1, 2, 3, 4, 5, 6, 7, 8], kind: "weekly", color: "#c48658" },
  { id: "challenge-2", title: "30 dias sem gastos", subtitle: "Compre apenas o essencial", amount: 600, steps: 30, completed: [1, 2, 4, 5, 6, 8, 9, 10], kind: "calendar", color: "#9dad91" },
  { id: "challenge-3", title: "Café feito em casa", subtitle: "Economize o valor do cafezinho", amount: 300, steps: 30, completed: [1, 2, 3, 4, 5, 7, 8, 9, 11, 12], kind: "coffee", color: "#dfa69a" },
  { id: "challenge-4", title: "Reserva de emergência", subtitle: "Construa sua tranquilidade", amount: 5000, steps: 20, completed: [1, 2, 3, 4, 5, 6], kind: "emergency", color: "#d5a74e" },
];

const categories: DreamCategory[] = ["Viagem", "Casa", "Compra", "Experiência", "Pessoal"];
const colors = ["#c48658", "#9dad91", "#dfa69a", "#d5a74e", "#a88973"];
const todayISO = () => new Date().toISOString().slice(0, 10);
const getDeposits = (dream: Dream): DreamDeposit[] => {
  if (dream.deposits) return dream.deposits;
  if (dream.saved > 0) return [{ id: `initial-${dream.id}`, amount: dream.saved, date: "", note: "Saldo inicial" }];
  return [];
};
const getSaved = (dream: Dream) => getDeposits(dream).reduce((sum, deposit) => sum + deposit.amount, 0);
const withDeposits = (dream: Dream, deposits: DreamDeposit[]): Dream => ({
  ...dream,
  deposits,
  saved: deposits.reduce((sum, deposit) => sum + deposit.amount, 0),
});

function Progress({ value, color }: { value: number; color: string }) {
  return <div className="dream-progress"><span style={{ width: `${Math.min(100, value)}%`, background: color }} /></div>;
}

function IconForCategory({ category, size = 18 }: { category: DreamCategory; size?: number }) {
  if (category === "Viagem") return <Plane size={size} />;
  if (category === "Casa") return <Home size={size} />;
  if (category === "Compra") return <Gift size={size} />;
  if (category === "Experiência") return <Star size={size} />;
  return <Heart size={size} />;
}

function DreamModal({ onClose, onSave }: { onClose: () => void; onSave: (dream: Dream) => void }) {
  const [form, setForm] = useState({ title: "", category: "Viagem" as DreamCategory, target: 0, deadline: "", why: "", color: colors[0] });
  return (
    <div className="dream-modal-backdrop" onMouseDown={onClose}>
      <form className="dream-modal" onMouseDown={(event) => event.stopPropagation()} onSubmit={(event) => {
        event.preventDefault();
        if (!form.title.trim() || form.target <= 0) return;
        onSave({ ...form, id: crypto.randomUUID(), saved: 0 });
        onClose();
      }}>
        <div className="modal-title"><span><Sparkles size={20} /></span><div><h2>Novo sonho</h2><p>Dê um nome e um caminho para o que faz seu coração brilhar.</p></div><button type="button" onClick={onClose}><X size={18} /></button></div>
        <div className="dream-form">
          <label className="wide">Qual é o seu sonho?<input autoFocus value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex.: Conhecer a Itália" /></label>
          <label>Categoria<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as DreamCategory })}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Valor necessário<input type="number" min="1" value={form.target || ""} onChange={(e) => setForm({ ...form, target: Number(e.target.value) })} placeholder="0,00" /></label>
          <label>Data desejada<input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></label>
          <label>Cor do sonho<div className="color-options">{colors.map((color) => <button type="button" aria-label={`Selecionar cor ${color}`} key={color} className={form.color === color ? "selected" : ""} style={{ background: color }} onClick={() => setForm({ ...form, color })} />)}</div></label>
          <label className="wide">Por que isso importa para você?<textarea value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} placeholder="Escreva a motivação que vai manter este sonho vivo..." /></label>
        </div>
        <div className="modal-actions"><button type="button" className="dream-btn ghost" onClick={onClose}>Cancelar</button><button className="dream-btn primary"><Sparkles size={16} /> Criar meu sonho</button></div>
      </form>
    </div>
  );
}

function DepositModal({ dream, onClose, onDeposit }: { dream: Dream; onClose: () => void; onDeposit: (amount: number, note: string) => void }) {
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  return (
    <div className="dream-modal-backdrop" onMouseDown={onClose}>
      <form className="dream-modal small" onMouseDown={(event) => event.stopPropagation()} onSubmit={(event) => { event.preventDefault(); if (amount > 0) { onDeposit(amount, note); onClose(); } }}>
        <div className="modal-title"><span><PiggyBank size={20} /></span><div><h2>Guardar para o sonho</h2><p>{dream.title}</p></div><button type="button" onClick={onClose}><X size={18} /></button></div>
        <label className="deposit-label">Quanto você quer guardar agora?<input autoFocus type="number" min="1" step="0.01" value={amount || ""} onChange={(e) => setAmount(Number(e.target.value))} placeholder="R$ 0,00" /></label>
        <label className="deposit-label">AnotaÃ§Ã£o opcional<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ex.: DepÃ³sito do salÃ¡rio" /></label>
        <div className="quick-values">{[25, 50, 100, 200].map((value) => <button type="button" key={value} onClick={() => setAmount(value)}>+ {money(value)}</button>)}</div>
        <div className="modal-actions"><button type="button" className="dream-btn ghost" onClick={onClose}>Cancelar</button><button className="dream-btn primary">Confirmar depósito</button></div>
      </form>
    </div>
  );
}

export default function PlannerSonhos() {
  const [view, setView] = useState<View>("inicio");
  const [dreams, setDreams] = useLocalStorage<Dream[]>("cozy_dreams_v1", initialDreams);
  const [challenges, setChallenges] = useLocalStorage<Challenge[]>("cozy_challenges_v1", initialChallenges);
  const [dreamModal, setDreamModal] = useState(false);
  const [depositDream, setDepositDream] = useState<Dream | null>(null);

  const totalTarget = dreams.reduce((sum, dream) => sum + dream.target, 0);
  const totalSaved = dreams.reduce((sum, dream) => sum + getSaved(dream), 0);
  const completedSteps = challenges.reduce((sum, item) => sum + item.completed.length, 0);
  const totalSteps = challenges.reduce((sum, item) => sum + item.steps, 0);
  const earned = Math.round((completedSteps / totalSteps) * 100);
  const closest = useMemo(() => [...dreams].sort((a, b) => (getSaved(b) / b.target) - (getSaved(a) / a.target))[0], [dreams]);

  const menu: { id: View; label: string; icon: typeof Home }[] = [
    { id: "inicio", label: "Meu caminho", icon: Home },
    { id: "sonhos", label: "Meus sonhos", icon: Sparkles },
    { id: "cofrinhos", label: "Cofrinhos", icon: PiggyBank },
    { id: "desafios", label: "Desafios", icon: Target },
    { id: "conquistas", label: "Conquistas", icon: Trophy },
  ];

  const addDeposit = (dream: Dream, amount: number, note: string) => setDreams((items) => items.map((item) => {
    if (item.id !== dream.id) return item;
    const deposits = [...getDeposits(item), { id: crypto.randomUUID(), amount, date: todayISO(), note: note.trim() || "DepÃ³sito" }];
    return withDeposits(item, deposits);
  }));
  const updateDeposit = (dreamId: string, depositId: string, amount: number) => setDreams((items) => items.map((item) => {
    if (item.id !== dreamId) return item;
    const deposits = getDeposits(item).map((deposit) => deposit.id === depositId ? { ...deposit, amount: Math.max(0, amount) } : deposit);
    return withDeposits(item, deposits);
  }));
  const removeDeposit = (dreamId: string, depositId: string) => setDreams((items) => items.map((item) => {
    if (item.id !== dreamId) return item;
    return withDeposits(item, getDeposits(item).filter((deposit) => deposit.id !== depositId));
  }));
  const toggleStep = (challenge: Challenge, step: number) => setChallenges((items) => items.map((item) => item.id === challenge.id ? { ...item, completed: item.completed.includes(step) ? item.completed.filter((value) => value !== step) : [...item.completed, step] } : item));

  return (
    <div className="dream-app">
      <header className="dream-hero">
        <div className="dream-hero-inner">
          <div className="dream-brand"><div className="dream-brand-mark"><Coffee size={28} /></div><div><span>COZY COFFEE • EDIÇÃO DOS SONHOS</span><h1>Planner dos Sonhos & Desafios</h1><p>Um cantinho aconchegante para transformar desejos em conquistas.</p></div></div>
          <div className="hero-note"><Sparkles size={17} /><div><strong>Pequenos passos, grandes sonhos</strong><span>Seu progresso é salvo automaticamente.</span></div></div>
        </div>
      </header>

      <main className="dream-shell">
        <nav className="dream-nav">{menu.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><Icon size={17} />{label}</button>)}</nav>

        {view === "inicio" && <>
          <section className="welcome-row"><div><span className="eyebrow">SEU MAPA DE SONHOS</span><h2>Bom café, bons planos e um passo de cada vez.</h2><p>Veja o que está florescendo e escolha onde colocar sua energia hoje.</p></div><button className="dream-btn primary" onClick={() => setDreamModal(true)}><Plus size={17} /> Novo sonho</button></section>
          <section className="dream-kpis">
            <article><span className="caramel"><Sparkles size={21} /></span><div><p>Sonhos em movimento</p><strong>{dreams.length}</strong><small>cada um com seu próprio caminho</small></div></article>
            <article><span className="sage"><PiggyBank size={21} /></span><div><p>Total guardado</p><strong>{money(totalSaved)}</strong><small>de {money(totalTarget)} planejados</small></div></article>
            <article><span className="rose"><CalendarCheck size={21} /></span><div><p>Passos concluídos</p><strong>{completedSteps}</strong><small>em desafios ativos</small></div></article>
            <article><span className="gold"><Award size={21} /></span><div><p>Nível de conquista</p><strong>{earned}%</strong><small>continue colecionando vitórias</small></div></article>
          </section>
          {closest && <section className="spotlight">
            <div className="spotlight-copy">
              <span style={{ color: "#fff0b8", textShadow: "0 1px 5px rgba(55,32,20,.45)" }}>
                <Star size={14} /> SONHO MAIS PERTO DE ACONTECER
              </span>
              <h3 style={{ color: "#fff7ec", textShadow: "0 2px 8px rgba(55,32,20,.45)" }}>
                {closest.title}
              </h3>
              <p style={{ color: "#ffe7d1", textShadow: "0 1px 4px rgba(55,32,20,.35)" }}>
                {closest.why}
              </p>
              <div className="spotlight-values">
                <strong style={{ color: "#fff7ec", textShadow: "0 2px 7px rgba(55,32,20,.45)" }}>
                  {money(getSaved(closest))}
                </strong>
                <span style={{ color: "#f6d7bd" }}>de {money(closest.target)}</span>
              </div>
              <Progress value={(getSaved(closest) / closest.target) * 100} color="#f4d6af" />
              <button
                style={{ color: "#fff0b8", textShadow: "0 1px 5px rgba(55,32,20,.45)" }}
                onClick={() => setDepositDream(closest)}
              >
                Guardar um pouquinho <ChevronRight size={16} />
              </button>
            </div>
            <div className="spotlight-art">
              <Coffee size={62} color="#fff7ec" />
              <Sparkles size={24} color="#fff0b8" />
              <span style={{ color: "#fff7ec", textShadow: "0 2px 8px rgba(55,32,20,.45)" }}>
                {Math.round((getSaved(closest) / closest.target) * 100)}%
              </span>
              <p style={{ color: "#f6d7bd", textShadow: "0 1px 4px rgba(55,32,20,.35)" }}>
                Seu sonho está ganhando forma
              </p>
            </div>
          </section>}
          <section className="two-columns"><article className="dream-panel"><PanelTitle icon={<Target size={18} />} title="Desafios em andamento" subtitle="Marque mais um passo hoje" action="Ver todos" onClick={() => setView("desafios")} />{challenges.slice(0, 3).map((item) => <div className="mini-challenge" key={item.id}><span style={{ color: item.color, background: `${item.color}20` }}><ChallengeIcon kind={item.kind} /></span><div><strong>{item.title}</strong><small>{item.completed.length} de {item.steps} etapas</small><Progress value={(item.completed.length / item.steps) * 100} color={item.color} /></div><b>{Math.round((item.completed.length / item.steps) * 100)}%</b></div>)}</article>
            <article className="dream-panel coffee-letter"><Coffee size={34} /><span>LEMBRETE DO DIA</span><h3>Seu sonho não precisa acontecer de uma vez.</h3><p>Guardar um valor pequeno, dizer não a uma compra ou revisar sua meta já conta como progresso.</p><button onClick={() => setView("cofrinhos")}>Abrir meus cofrinhos <ChevronRight size={16} /></button></article></section>
        </>}

        {view === "sonhos" && <Page title="Meus sonhos" eyebrow="VISÃO DOS SONHOS" description="Tudo aquilo que merece um plano, um prazo e um lugar especial." action={<button className="dream-btn primary" onClick={() => setDreamModal(true)}><Plus size={17} /> Novo sonho</button>}>
          <div className="dream-grid">{dreams.map((dream) => <article className="dream-card" key={dream.id} style={{ "--dream-color": dream.color } as React.CSSProperties}><div className="dream-card-top"><span><IconForCategory category={dream.category} /></span><div><small>{dream.category}</small><h3>{dream.title}</h3></div><button aria-label="Excluir sonho" onClick={() => setDreams((items) => items.filter((item) => item.id !== dream.id))}><Trash2 size={15} /></button></div><p>{dream.why || "Um sonho especial esperando pelo próximo passo."}</p><div className="dream-money"><strong>{money(dream.saved)}</strong><span>de {money(dream.target)}</span></div><Progress value={(dream.saved / dream.target) * 100} color={dream.color} /><div className="dream-card-foot"><span><CalendarCheck size={14} /> {dream.deadline ? new Date(`${dream.deadline}T12:00:00`).toLocaleDateString("pt-BR", { month: "short", year: "numeric" }) : "Sem prazo"}</span><button onClick={() => setDepositDream(dream)}><Plus size={14} /> Guardar</button></div></article>)}</div>
        </Page>}

        {view === "cofrinhos" && <Page title="Cofrinhos dos sonhos" eyebrow="GUARDE COM PROPÓSITO" description="Cada depósito é um voto de confiança no seu futuro.">
          <section className="savings-summary"><div><span><PiggyBank size={28} /></span><div><small>TOTAL GUARDADO NOS SONHOS</small><strong>{money(totalSaved)}</strong><p>{totalTarget ? Math.round((totalSaved / totalTarget) * 100) : 0}% do caminho completo</p></div></div><Progress value={totalTarget ? (totalSaved / totalTarget) * 100 : 0} color="#c48658" /></section>
          <div className="jar-grid">{dreams.map((dream) => { const percent = Math.min(100, (dream.saved / dream.target) * 100); return <article className="jar-card" key={dream.id}><div className="jar"><div className="jar-fill" style={{ height: `${percent}%`, background: `${dream.color}88` }} /><PiggyBank size={48} /><b>{Math.round(percent)}%</b></div><div><span>{dream.category}</span><h3>{dream.title}</h3><p>Faltam <strong>{money(Math.max(0, dream.target - dream.saved))}</strong></p><button className="dream-btn primary" onClick={() => setDepositDream(dream)}><Plus size={15} /> Fazer depósito</button></div></article>})}</div>
        </Page>}

        {view === "desafios" && <Page title="Desafios financeiros" eyebrow="ECONOMIZAR TAMBÉM PODE SER DIVERTIDO" description="Clique nas etapas concluídas e veja seu progresso ganhar vida.">
          <div className="challenge-grid">{challenges.map((challenge) => <article className="challenge-card" key={challenge.id} style={{ "--challenge-color": challenge.color } as React.CSSProperties}><div className="challenge-head"><span><ChallengeIcon kind={challenge.kind} /></span><div><small>META: {money(challenge.amount)}</small><h3>{challenge.title}</h3><p>{challenge.subtitle}</p></div><b>{challenge.completed.length}/{challenge.steps}</b></div><Progress value={(challenge.completed.length / challenge.steps) * 100} color={challenge.color} /><div className={`step-grid ${challenge.steps > 40 ? "compact" : ""}`}>{Array.from({ length: challenge.steps }, (_, index) => index + 1).map((step) => <button aria-label={`Etapa ${step}`} key={step} className={challenge.completed.includes(step) ? "done" : ""} onClick={() => toggleStep(challenge, step)}>{challenge.completed.includes(step) ? <Check size={12} /> : step}</button>)}</div><div className="challenge-foot"><span><CircleDollarSign size={15} /> Aproximadamente {money((challenge.amount / challenge.steps) * challenge.completed.length)} conquistados</span><strong>{Math.round((challenge.completed.length / challenge.steps) * 100)}%</strong></div></article>)}</div>
        </Page>}

        {view === "conquistas" && <Page title="Minha estante de conquistas" eyebrow="CELEBRE CADA PASSO" description="Porque reconhecer o caminho percorrido também faz parte do sonho.">
          <section className="level-card"><div className="level-ring" style={{ "--level": `${earned * 3.6}deg` } as React.CSSProperties}><span><Trophy size={28} /><b>{earned}%</b></span></div><div><small>NÍVEL ATUAL</small><h3>Criadora de possibilidades</h3><p>Você já concluiu {completedSteps} pequenos passos. Continue e novas conquistas serão desbloqueadas.</p><Progress value={earned} color="#d5a74e" /></div></section>
          <div className="badge-grid"><Badge icon={<Coffee />} title="Primeiro cafezinho" text="Concluiu sua primeira etapa" unlocked={completedSteps >= 1} /><Badge icon={<PiggyBank />} title="Cofrinho feliz" text="Guardou mais de R$ 1.000" unlocked={totalSaved >= 1000} /><Badge icon={<Target />} title="Foco delicado" text="Concluiu 25 etapas" unlocked={completedSteps >= 25} /><Badge icon={<Plane />} title="Sonho com destino" text="Criou uma meta de viagem" unlocked={dreams.some((item) => item.category === "Viagem")} /><Badge icon={<Star />} title="Metade do caminho" text="Alcançou 50% de um sonho" unlocked={dreams.some((item) => item.saved / item.target >= .5)} /><Badge icon={<Trophy />} title="Desafio completo" text="Finalizou um desafio inteiro" unlocked={challenges.some((item) => item.completed.length === item.steps)} /></div>
        </Page>}
        {view === "cofrinhos" && <DepositHistory dreams={dreams} onUpdate={updateDeposit} onRemove={removeDeposit} />}
      </main>

      {dreamModal && <DreamModal onClose={() => setDreamModal(false)} onSave={(dream) => setDreams((items) => [dream, ...items])} />}
      {depositDream && <DepositModal dream={depositDream} onClose={() => setDepositDream(null)} onDeposit={(amount, note) => addDeposit(depositDream, amount, note)} />}
    </div>
  );
}

function Page({ title, eyebrow, description, action, children }: { title: string; eyebrow: string; description: string; action?: React.ReactNode; children: React.ReactNode }) {
  return <><section className="page-heading"><div><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p></div>{action}</section>{children}</>;
}

function DepositHistory({
  dreams,
  onUpdate,
  onRemove,
}: {
  dreams: Dream[];
  onUpdate: (dreamId: string, depositId: string, amount: number) => void;
  onRemove: (dreamId: string, depositId: string) => void;
}) {
  return (
    <section className="deposit-history">
      <div className="deposit-history-head">
        <span><Edit3 size={18} /></span>
        <div>
          <small>AJUSTES DOS COFRINHOS</small>
          <h3>HistÃ³rico de depÃ³sitos</h3>
          <p>Corrija um valor digitado errado ou exclua apenas um depÃ³sito, sem apagar o sonho inteiro.</p>
        </div>
      </div>
      <div className="deposit-history-grid">
        {dreams.map((dream) => {
          const deposits = getDeposits(dream);
          return (
            <article className="deposit-history-card" key={dream.id}>
              <div className="deposit-history-title">
                <span style={{ background: `${dream.color}22`, color: dream.color }}><IconForCategory category={dream.category} size={17} /></span>
                <div>
                  <h4>{dream.title}</h4>
                  <small>{money(getSaved(dream))} guardados</small>
                </div>
              </div>
              {deposits.length ? (
                <div className="deposit-list">
                  {deposits.map((deposit) => (
                    <div className="deposit-row" key={deposit.id}>
                      <div>
                        <strong>{deposit.note || "DepÃ³sito"}</strong>
                        <small>{deposit.date || "Valor anterior"}</small>
                      </div>
                      <input
                        aria-label={`Editar depÃ³sito de ${dream.title}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={deposit.amount || ""}
                        onChange={(event) => onUpdate(dream.id, deposit.id, Number(event.target.value))}
                      />
                      <button type="button" aria-label="Excluir depÃ³sito" onClick={() => onRemove(dream.id, deposit.id)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="deposit-empty">Nenhum depÃ³sito registrado ainda.</p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PanelTitle({ icon, title, subtitle, action, onClick }: { icon: React.ReactNode; title: string; subtitle: string; action: string; onClick: () => void }) {
  return <div className="panel-title"><span>{icon}</span><div><h3>{title}</h3><p>{subtitle}</p></div><button onClick={onClick}>{action} <ChevronRight size={14} /></button></div>;
}

function ChallengeIcon({ kind }: { kind: Challenge["kind"] }) {
  if (kind === "coffee") return <Coffee size={19} />;
  if (kind === "calendar") return <CalendarCheck size={19} />;
  if (kind === "emergency") return <PiggyBank size={19} />;
  return <Flag size={19} />;
}

function Badge({ icon, title, text, unlocked }: { icon: React.ReactNode; title: string; text: string; unlocked: boolean }) {
  return <article className={`badge-card ${unlocked ? "unlocked" : ""}`}><span>{unlocked ? icon : <Lightbulb />}</span><div><small>{unlocked ? "CONQUISTA DESBLOQUEADA" : "AINDA BLOQUEADA"}</small><h3>{title}</h3><p>{text}</p></div>{unlocked && <Award size={20} />}</article>;
}
