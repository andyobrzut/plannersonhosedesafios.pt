import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  BarChart3,
  CircleDollarSign,
  Edit3,
  Flag,
  LayoutDashboard,
  ListChecks,
  Plus,
  ReceiptText,
  Rocket,
  Sparkles,
  SlidersHorizontal,
  Target,
  Trash2,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import "@/finance-theme.css";

type Tipo = "receita" | "despesa";
type Natureza = "fixo" | "variavel";
type View = "inicio" | "visao" | "lancamentos" | "calendario" | "relatorios" | "metas";

interface Transacao {
  id: string;
  data: string;
  descricao: string;
  categoria: string;
  forma: string;
  valor: number;
  tipo: Tipo;
  natureza: Natureza;
  parcelas: number;
}

interface Meta {
  id: string;
  titulo: string;
  alvo: number;
  guardado: number;
  cor: string;
}

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const CATEGORIAS_PADRAO = [
  "Contas", "Saúde", "Lazer", "Transporte", "Vestuário",
  "Despesas eventuais", "Ifood", "Mercado", "Assinaturas",
  "Academia", "Presentes", "Desenvolvimento", "Internet",
];

const FORMAS_PADRAO = [
  "À Vista", "À Prazo", "Cartão Débito", "Cartão Crédito", "Pix",
  "Dinheiro", "Boleto", "Cartão 1", "Cartão 2", "Cartão 3",
  "Cartão 4", "Cartão 5", "Cartão 6",
];

const CORES = ["#8870c6", "#ff8fa7", "#65c7ae", "#f6c453", "#79bde8", "#f095c4", "#ad9be0"];
const formatar = (valor: number) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const hoje = new Date();
const dataISO = (dia: number, mes: number) => `${hoje.getFullYear()}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

const iniciais: Transacao[] = [
  { id: "demo-1", data: dataISO(5, hoje.getMonth()), descricao: "Salário mensal", categoria: "Desenvolvimento", forma: "Pix", valor: 4800, tipo: "receita", natureza: "fixo", parcelas: 1 },
  { id: "demo-2", data: dataISO(8, hoje.getMonth()), descricao: "Mercado da semana", categoria: "Mercado", forma: "Cartão Crédito", valor: 386.4, tipo: "despesa", natureza: "variavel", parcelas: 1 },
  { id: "demo-3", data: dataISO(10, hoje.getMonth()), descricao: "Internet", categoria: "Internet", forma: "Boleto", valor: 119.9, tipo: "despesa", natureza: "fixo", parcelas: 1 },
  { id: "demo-4", data: dataISO(14, hoje.getMonth()), descricao: "Projeto freelance", categoria: "Desenvolvimento", forma: "Pix", valor: 950, tipo: "receita", natureza: "variavel", parcelas: 1 },
  { id: "demo-5", data: dataISO(18, hoje.getMonth()), descricao: "Academia", categoria: "Academia", forma: "Cartão 1", valor: 89.9, tipo: "despesa", natureza: "fixo", parcelas: 1 },
];

const metasIniciais: Meta[] = [
  { id: "meta-1", titulo: "Reserva de emergência", alvo: 10000, guardado: 4200, cor: "#8870c6" },
  { id: "meta-2", titulo: "Viagem dos sonhos", alvo: 5000, guardado: 1850, cor: "#65c7ae" },
];

function ModalLancamento({ onClose, onSave, mes, categorias, formas }: { onClose: () => void; onSave: (t: Transacao) => void; mes: number; categorias: string[]; formas: string[] }) {
  const [form, setForm] = useState<Omit<Transacao, "id">>({
    data: dataISO(hoje.getDate(), mes), descricao: "", categoria: categorias[0],
    forma: formas[0], valor: 0, tipo: "despesa", natureza: "variavel", parcelas: 1,
  });
  const update = (campo: keyof typeof form, valor: string | number) => setForm((atual) => ({ ...atual, [campo]: valor }));

  return (
    <div className="finance-modal-backdrop" onMouseDown={onClose}>
      <form className="finance-modal" onMouseDown={(e) => e.stopPropagation()} onSubmit={(e) => {
        e.preventDefault();
        if (!form.descricao.trim() || form.valor <= 0) return;
        onSave({ ...form, id: crypto.randomUUID() });
        onClose();
      }}>
        <div className="finance-section-title">
          <span><Plus size={18} /></span>
          <div><h2>Novo lançamento</h2><p>Registre cada detalhe do seu cantinho financeiro.</p></div>
        </div>
        <div className="finance-form-grid">
          <label>Tipo<select value={form.tipo} onChange={(e) => update("tipo", e.target.value)}><option value="despesa">Despesa</option><option value="receita">Receita</option></select></label>
          <label>Data<input type="date" value={form.data} onChange={(e) => update("data", e.target.value)} /></label>
          <label className="wide">Descrição<input autoFocus value={form.descricao} onChange={(e) => update("descricao", e.target.value)} placeholder="Ex.: Compras do mês" /></label>
          <label>Categoria<select value={form.categoria} onChange={(e) => update("categoria", e.target.value)}>{categorias.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label>Forma de pagamento<select value={form.forma} onChange={(e) => update("forma", e.target.value)}>{formas.map((f) => <option key={f}>{f}</option>)}</select></label>
          <label>Natureza<select value={form.natureza} onChange={(e) => update("natureza", e.target.value)}><option value="fixo">Custo fixo</option><option value="variavel">Custo variável</option></select></label>
          <label>Valor<input type="number" min="0" step="0.01" value={form.valor || ""} onChange={(e) => update("valor", Number(e.target.value))} placeholder="0,00" /></label>
          <label>Parcelas<input type="number" min="1" max="48" value={form.parcelas} onChange={(e) => update("parcelas", Number(e.target.value))} /></label>
        </div>
        <div className="finance-modal-actions"><button type="button" className="finance-btn ghost" onClick={onClose}>Cancelar</button><button className="finance-btn primary">Salvar lançamento</button></div>
      </form>
    </div>
  );
}

export default function ControleFinanceiro() {
  const [view, setView] = useState<View>("visao");
  const [mes, setMes] = useState(hoje.getMonth());
  const [modal, setModal] = useState(false);
  const [transacoes, setTransacoes] = useLocalStorage<Transacao[]>("cosmic_financas_transacoes_v1", iniciais);
  const [metas, setMetas] = useLocalStorage<Meta[]>("cosmic_financas_metas_v1", metasIniciais);
  const [orcamentos, setOrcamentos] = useLocalStorage<Record<string, number>>("cosmic_financas_orcamentos_v1", {});
  const [categorias, setCategorias] = useLocalStorage<string[]>("cosmic_financas_categorias_v1", CATEGORIAS_PADRAO);
  const [formas, setFormas] = useLocalStorage<string[]>("cosmic_financas_formas_v1", FORMAS_PADRAO);

  const doMes = useMemo(() => transacoes.filter((t) => new Date(`${t.data}T12:00:00`).getMonth() === mes), [transacoes, mes]);
  const receitas = doMes.filter((t) => t.tipo === "receita").reduce((s, t) => s + t.valor, 0);
  const despesas = doMes.filter((t) => t.tipo === "despesa").reduce((s, t) => s + t.valor, 0);
  const saldo = receitas - despesas;
  const orcamento = orcamentos[String(mes)] || 3000;
  const economia = receitas ? Math.max(0, (saldo / receitas) * 100) : 0;

  const porCategoria = categorias.map((categoria) => ({
    name: categoria,
    value: doMes.filter((t) => t.tipo === "despesa" && t.categoria === categoria).reduce((s, t) => s + t.valor, 0),
  })).filter((item) => item.value > 0).sort((a, b) => b.value - a.value);

  const comparativo = MESES.map((nome, indice) => {
    const itens = transacoes.filter((t) => new Date(`${t.data}T12:00:00`).getMonth() === indice);
    return {
      name: nome.slice(0, 3),
      Receitas: itens.filter((t) => t.tipo === "receita").reduce((s, t) => s + t.valor, 0),
      Despesas: itens.filter((t) => t.tipo === "despesa").reduce((s, t) => s + t.valor, 0),
    };
  });

  const remover = (id: string) => setTransacoes((atuais) => atuais.filter((t) => t.id !== id));
  const adicionar = (t: Transacao) => setTransacoes((atuais) => [t, ...atuais]);

  const menu: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "inicio", label: "Comece aqui", icon: SlidersHorizontal },
    { id: "relatorios", label: "Comparativo anual", icon: BarChart3 },
    { id: "visao", label: "Resumo mensal", icon: LayoutDashboard },
    { id: "lancamentos", label: "Lançamentos", icon: ReceiptText },
    { id: "calendario", label: "Calendário", icon: CalendarDays },
    { id: "metas", label: "Metas", icon: Target },
  ];

  return (
    <div className="cosmic-finance finance-app">
      <header className="finance-hero">
        <div className="finance-hero-inner">
          <div className="finance-brand">
            <div className="finance-brand-mark"><CircleDollarSign size={27} /></div>
            <div><span>COZY COFFEE • FINANÇAS</span><h1>Meu Cantinho Financeiro</h1><p>Organize suas finanças com a calma de um café quentinho.</p></div>
          </div>
          <div className={`finance-mascot ${saldo < 0 ? "alerta" : ""}`}>
            <img src="/assets/coffee/cozy-coffee-banner.png" alt="Cafeteria Cozy Coffee" />
            <div><Sparkles size={14} /><strong>{saldo >= 0 ? "Seu café financeiro está perfeito!" : "Hora de preparar um novo plano"}</strong><span>{saldo >= 0 ? "Saboreie o progresso e continue poupando." : "Pequenos ajustes deixam tudo mais leve."}</span></div>
          </div>
          <div className="finance-product-badge"><Sparkles size={15} /><span>PLANILHA-APP</span><strong>Dados salvos automaticamente</strong></div>
        </div>
      </header>

      <main className="finance-shell">
        <nav className="finance-app-nav">
          {menu.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><Icon size={16} />{label}</button>)}
        </nav>
        <nav className="finance-months notranslate" aria-label="Selecionar mês" translate="no">
          {MESES.map((nome, i) => <button key={nome} translate="no" className={mes === i && !["inicio", "relatorios"].includes(view) ? "active" : ""} onClick={() => { setMes(i); setView("visao"); }}>{nome}</button>)}
        </nav>
        <div className="finance-toolbar">
          <div className="finance-context"><span>{view === "inicio" ? "Configuração da sua planilha-app" : view === "relatorios" ? `Visão completa de ${hoje.getFullYear()}` : `${MESES[mes]} de ${hoje.getFullYear()}`}</span><strong>{view === "inicio" ? "Personalize antes de começar" : view === "relatorios" ? "Comparativo anual" : "Sua planilha mensal interativa"}</strong></div>
          <button className="finance-btn primary" onClick={() => setModal(true)}><Plus size={17} /> Novo lançamento</button>
        </div>

        {view === "inicio" && <Configuracoes categorias={categorias} setCategorias={setCategorias} formas={formas} setFormas={setFormas} comecar={() => setView("visao")} />}
        {view === "visao" && <>
          <section className="finance-heading"><div><span className="eyebrow">{MESES[mes]} • {hoje.getFullYear()}</span><h2>Olá, exploradora financeira!</h2><p>Acompanhe seu mês e tome decisões mais tranquilas.</p></div><button className="sheet-link" onClick={() => setView("lancamentos")}><ListChecks size={16} /> Abrir planilha do mês</button></section>
          <section className={`balance-story ${saldo >= 0 ? "positive" : "negative"}`}>
            <img src={saldo >= 0 ? "/assets/coffee/finance/saldo-positivo.png" : "/assets/coffee/finance/saldo-negativo.png"} alt={saldo >= 0 ? "Coelhinho feliz com o saldo positivo" : "Coelhinho triste com o saldo negativo"} />
            <div className="balance-story-copy">
              <span><Sparkles size={13} /> RESUMO FINANCEIRO DE {MESES[mes].toUpperCase()}</span>
              <h3>{saldo >= 0 ? "Seu cantinho financeiro está uma delícia!" : "Seu coelhinho precisa de uma pausa para o café."}</h3>
              <p>{saldo >= 0 ? "As receitas superaram as despesas. Aproveite para fortalecer suas metas e reservas." : "As despesas passaram das receitas. Respire, prepare um café e revise os gastos variáveis com calma."}</p>
              <strong>{saldo >= 0 ? "Saldo positivo" : "Saldo negativo"} <b>{formatar(Math.abs(saldo))}</b></strong>
            </div>
          </section>
          <section className="finance-kpis">
            <article className="finance-kpi purple"><span><WalletCards size={20} /></span><div><p>Saldo disponível</p><strong>{formatar(saldo)}</strong><small>{saldo >= 0 ? "Tudo sob controle por aqui" : "Atenção ao seu fluxo do mês"}</small></div></article>
            <article className="finance-kpi mint"><span><ArrowUpRight size={20} /></span><div><p>Total de receitas</p><strong>{formatar(receitas)}</strong><small>{doMes.filter((t) => t.tipo === "receita").length} entradas registradas</small></div></article>
            <article className="finance-kpi pink"><span><ArrowDownLeft size={20} /></span><div><p>Total de despesas</p><strong>{formatar(despesas)}</strong><small>{doMes.filter((t) => t.tipo === "despesa").length} saídas registradas</small></div></article>
            <article className="finance-kpi gold"><span><Rocket size={20} /></span><div><p>Taxa de economia</p><strong>{economia.toFixed(0)}%</strong><small>{economia >= 20 ? "Você superou a meta de 20%" : "Seu próximo marco é chegar a 20%"}</small></div></article>
          </section>
          <section className="finance-grid-main">
            <article className="finance-panel">
              <div className="panel-head"><div><h3>Mapa de gastos</h3><p>Onde seus recursos pousaram neste mês</p></div><button onClick={() => setView("relatorios")}>Ver relatório</button></div>
              {porCategoria.length ? <div className="category-map"><div className="donut-wrap"><ResponsiveContainer width="100%" height={235}><PieChart><Pie data={porCategoria} dataKey="value" innerRadius={62} outerRadius={94} paddingAngle={3}>{porCategoria.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}</Pie><Tooltip formatter={(v: number) => formatar(v)} /></PieChart></ResponsiveContainer><div className="donut-center"><span>Despesas</span><strong>{formatar(despesas)}</strong></div></div><div className="category-list">{porCategoria.slice(0, 5).map((item, i) => <div key={item.name}><span style={{ background: CORES[i % CORES.length] }} /><p>{item.name}<small>{despesas ? ((item.value / despesas) * 100).toFixed(0) : 0}% do total</small></p><strong>{formatar(item.value)}</strong></div>)}</div></div> : <Empty texto="Ainda não há despesas neste mês." />}
            </article>
            <article className="finance-panel">
              <div className="panel-head"><div><h3>Orçamento do mês</h3><p>Seu limite para viajar tranquila</p></div><Edit3 size={17} /></div>
              <div className="budget-number"><strong>{formatar(despesas)}</strong><span>de {formatar(orcamento)}</span></div>
              <div className="budget-track"><span style={{ width: `${Math.min(100, (despesas / orcamento) * 100)}%` }} /></div>
              <div className="budget-meta"><span>{((despesas / orcamento) * 100).toFixed(0)}% utilizado</span><strong>{formatar(Math.max(0, orcamento - despesas))} disponível</strong></div>
              <label className="budget-edit">Ajustar orçamento<input type="number" value={orcamento} onChange={(e) => setOrcamentos((o) => ({ ...o, [String(mes)]: Number(e.target.value) }))} /></label>
              <div className="cosmic-tip"><Sparkles size={18} /><div><strong>Dica cósmica</strong><p>{despesas <= orcamento * .7 ? "Seu orçamento está respirando bem. Que tal direcionar uma parte para uma meta?" : "Você já percorreu boa parte do orçamento. Revise os gastos variáveis antes da próxima compra."}</p></div></div>
            </article>
          </section>
          <Recentes itens={doMes} remover={remover} verTodos={() => setView("lancamentos")} />
        </>}

        {view === "lancamentos" && <section className="finance-panel page-panel"><div className="panel-head"><div><h3>Lançamentos de {MESES[mes]}</h3><p>Receitas, despesas, custos fixos e variáveis em um só lugar.</p></div><span className="count-pill">{doMes.length} registros</span></div><Tabela itens={doMes} remover={remover} /></section>}
        {view === "calendario" && <Calendario mes={mes} itens={doMes} />}
        {view === "relatorios" && <Relatorios comparativo={comparativo} porCategoria={porCategoria} despesas={despesas} itens={doMes} />}
        {view === "metas" && <Metas metas={metas} setMetas={setMetas} />}
      </main>
      {modal && <ModalLancamento mes={mes} categorias={categorias} formas={formas} onClose={() => setModal(false)} onSave={adicionar} />}
    </div>
  );
}

function Configuracoes({
  categorias,
  setCategorias,
  formas,
  setFormas,
  comecar,
}: {
  categorias: string[];
  setCategorias: React.Dispatch<React.SetStateAction<string[]>>;
  formas: string[];
  setFormas: React.Dispatch<React.SetStateAction<string[]>>;
  comecar: () => void;
}) {
  const [moeda, setMoeda] = useLocalStorage("cosmic_financas_moeda_v1", "R$");
  const [descontarCredito, setDescontarCredito] = useLocalStorage("cosmic_financas_credito_saldo_v1", true);
  const adicionarItem = (lista: string[], setLista: React.Dispatch<React.SetStateAction<string[]>>, nome: string) => {
    const novo = window.prompt(`Nome da nova ${nome}:`)?.trim();
    if (novo && !lista.includes(novo)) setLista((atual) => [...atual, novo]);
  };

  return (
    <section className="setup-page">
      <div className="setup-welcome">
        <div>
          <span className="eyebrow">BEM-VINDA AO SEU CANTINHO FINANCEIRO</span>
          <h2>Uma planilha com inteligência de app.</h2>
          <p>Configure uma vez e use durante todo o ano. Os resumos, calendários, gráficos e comparativos são atualizados automaticamente a cada lançamento.</p>
          <div className="setup-highlights">
            <span><CalendarDays size={16} /> 12 meses conectados</span>
            <span><BarChart3 size={16} /> Análises automáticas</span>
            <span><Target size={16} /> Metas e orçamento</span>
          </div>
          <button className="finance-btn primary" onClick={comecar}>Começar a organizar <ArrowUpRight size={16} /></button>
        </div>
        <img src="/assets/coffee/cozy-coffee-banner.png" alt="Cafeteria Cozy Coffee" />
      </div>

      <div className="setup-grid">
        <article className="finance-panel setup-card">
          <div className="panel-head"><div><h3>Configurações principais</h3><p>Preferências usadas em toda a planilha-app</p></div><SlidersHorizontal size={17} /></div>
          <label className="setup-field">Sua moeda
            <select value={moeda} onChange={(e) => setMoeda(e.target.value)}><option>R$</option><option>US$</option><option>€</option><option>£</option></select>
          </label>
          <label className="setup-switch">
            <button type="button" className={descontarCredito ? "on" : ""} onClick={() => setDescontarCredito((v) => !v)}><span /></button>
            <span><strong>Descontar compras no crédito do saldo</strong><small>Mostra uma visão mais conservadora do dinheiro disponível.</small></span>
          </label>
          <div className="setup-note"><Sparkles size={17} /><p>Seus dados ficam salvos automaticamente neste navegador. Nenhuma conta ou instalação é necessária.</p></div>
        </article>

        <ListaConfiguravel titulo="Categorias" subtitulo="As mesmas 13 categorias da planilha, totalmente editáveis" itens={categorias} setItens={setCategorias} adicionar={() => adicionarItem(categorias, setCategorias, "categoria")} restaurar={() => setCategorias(CATEGORIAS_PADRAO)} />
        <ListaConfiguravel titulo="Meios de pagamento" subtitulo="À vista, a prazo, cartões, Pix, boleto e dinheiro" itens={formas} setItens={setFormas} adicionar={() => adicionarItem(formas, setFormas, "forma de pagamento")} restaurar={() => setFormas(FORMAS_PADRAO)} />
      </div>
    </section>
  );
}

function ListaConfiguravel({ titulo, subtitulo, itens, setItens, adicionar, restaurar }: {
  titulo: string;
  subtitulo: string;
  itens: string[];
  setItens: React.Dispatch<React.SetStateAction<string[]>>;
  adicionar: () => void;
  restaurar: () => void;
}) {
  return (
    <article className="finance-panel setup-card">
      <div className="panel-head"><div><h3>{titulo}</h3><p>{subtitulo}</p></div><button onClick={adicionar}><Plus size={15} /> Adicionar</button></div>
      <div className="setup-list">{itens.map((item, indice) => <div key={`${item}-${indice}`}><input value={item} onChange={(e) => setItens((atuais) => atuais.map((valor, i) => i === indice ? e.target.value : valor))} /><button onClick={() => setItens((atuais) => atuais.filter((_, i) => i !== indice))} title="Remover"><Trash2 size={14} /></button></div>)}</div>
      <button className="restore-btn" onClick={restaurar}>Restaurar lista original</button>
    </article>
  );
}

function Empty({ texto }: { texto: string }) {
  return <div className="finance-empty"><Sparkles size={26} /><strong>Espaço pronto para brilhar</strong><span>{texto}</span></div>;
}

function Recentes({ itens, remover, verTodos }: { itens: Transacao[]; remover: (id: string) => void; verTodos: () => void }) {
  return <section className="finance-panel page-panel"><div className="panel-head"><div><h3>Últimos lançamentos</h3><p>Movimentações recentes do seu cantinho</p></div><button onClick={verTodos}>Ver todos</button></div>{itens.length ? <Tabela itens={itens.slice(0, 5)} remover={remover} /> : <Empty texto="Adicione seu primeiro lançamento." />}</section>;
}

function Tabela({ itens, remover }: { itens: Transacao[]; remover: (id: string) => void }) {
  return <div className="finance-table-wrap"><table className="finance-table"><thead><tr><th>Descrição</th><th>Data</th><th>Categoria</th><th>Pagamento</th><th>Natureza</th><th>Valor</th><th /></tr></thead><tbody>{itens.map((t) => <tr key={t.id}><td><span className={`transaction-icon ${t.tipo}`} >{t.tipo === "receita" ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}</span><strong>{t.descricao}</strong></td><td>{new Date(`${t.data}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</td><td><span className="soft-pill">{t.categoria}</span></td><td>{t.forma}{t.parcelas > 1 && <small> • {t.parcelas}x</small>}</td><td><span className={`nature-pill ${t.natureza}`}>{t.natureza === "fixo" ? "Fixo" : "Variável"}</span></td><td className={t.tipo}>{t.tipo === "receita" ? "+" : "-"} {formatar(t.valor)}</td><td><button className="icon-action" onClick={() => remover(t.id)} title="Excluir"><Trash2 size={15} /></button></td></tr>)}</tbody></table></div>;
}

function Calendario({ mes, itens }: { mes: number; itens: Transacao[] }) {
  const ano = hoje.getFullYear();
  const primeiro = new Date(ano, mes, 1).getDay();
  const dias = new Date(ano, mes + 1, 0).getDate();
  return <section className="finance-panel page-panel"><div className="panel-head"><div><h3>Calendário financeiro • {MESES[mes]}</h3><p>Verde para receitas, coral para despesas. Clique nos dias para planejar sua rota.</p></div><div className="calendar-legend"><span className="income-dot" /> Receitas <span className="expense-dot" /> Despesas</div></div><div className="finance-calendar">{["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => <strong key={d}>{d}</strong>)}{Array.from({ length: primeiro }).map((_, i) => <div className="blank" key={`b${i}`} />)}{Array.from({ length: dias }, (_, i) => i + 1).map((dia) => { const eventos = itens.filter((t) => new Date(`${t.data}T12:00:00`).getDate() === dia); return <div className={dia === hoje.getDate() && mes === hoje.getMonth() ? "today" : ""} key={dia}><b>{dia}</b>{eventos.slice(0, 3).map((e) => <span key={e.id} className={e.tipo}>{e.descricao}<small>{formatar(e.valor)}</small></span>)}</div>; })}</div></section>;
}

function Relatorios({ comparativo, porCategoria, despesas, itens }: { comparativo: { name: string; Receitas: number; Despesas: number }[]; porCategoria: { name: string; value: number }[]; despesas: number; itens: Transacao[] }) {
  const fixos = itens.filter((t) => t.tipo === "despesa" && t.natureza === "fixo").reduce((s, t) => s + t.valor, 0);
  const variaveis = itens.filter((t) => t.tipo === "despesa" && t.natureza === "variavel").reduce((s, t) => s + t.valor, 0);
  return <><section className="finance-grid-reports"><article className="finance-panel"><div className="panel-head"><div><h3>Comparativo anual</h3><p>Receitas e despesas mês a mês</p></div></div><ResponsiveContainer width="100%" height={310}><BarChart data={comparativo}><CartesianGrid strokeDasharray="3 3" stroke="#eee9fb" /><XAxis dataKey="name" /><YAxis hide /><Tooltip formatter={(v: number) => formatar(v)} /><Legend /><Bar dataKey="Receitas" fill="#65c7ae" radius={[6, 6, 0, 0]} /><Bar dataKey="Despesas" fill="#ff8fa7" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></article><article className="finance-panel"><div className="panel-head"><div><h3>Custos por natureza</h3><p>Equilíbrio entre fixos e variáveis</p></div></div><div className="nature-report"><div><span className="fixed-ring">{despesas ? ((fixos / despesas) * 100).toFixed(0) : 0}%</span><strong>Custos fixos</strong><small>{formatar(fixos)}</small></div><div><span className="variable-ring">{despesas ? ((variaveis / despesas) * 100).toFixed(0) : 0}%</span><strong>Custos variáveis</strong><small>{formatar(variaveis)}</small></div></div></article></section><section className="finance-panel page-panel"><div className="panel-head"><div><h3>Análise por categoria</h3><p>Detalhamento profissional dos seus gastos</p></div></div><div className="report-categories">{porCategoria.map((c, i) => <div key={c.name}><span style={{ background: CORES[i % CORES.length] }} /><strong>{c.name}</strong><div><i style={{ width: `${despesas ? (c.value / despesas) * 100 : 0}%`, background: CORES[i % CORES.length] }} /></div><b>{formatar(c.value)}</b><small>{despesas ? ((c.value / despesas) * 100).toFixed(1) : 0}%</small></div>)}</div></section></>;
}

function Metas({ metas, setMetas }: { metas: Meta[]; setMetas: React.Dispatch<React.SetStateAction<Meta[]>> }) {
  const adicionar = () => setMetas((m) => [...m, { id: crypto.randomUUID(), titulo: "Nova meta cósmica", alvo: 1000, guardado: 0, cor: CORES[m.length % CORES.length] }]);
  const atualizar = (id: string, campo: "titulo" | "alvo" | "guardado", valor: string | number) => setMetas((m) => m.map((meta) => meta.id === id ? { ...meta, [campo]: valor } : meta));
  return <section className="finance-panel page-panel"><div className="panel-head"><div><h3>Minhas estrelas poupadas</h3><p>Transforme grandes sonhos em pequenos passos possíveis.</p></div><button onClick={adicionar}><Plus size={15} /> Nova meta</button></div><div className="goals-grid">{metas.map((meta) => { const progresso = Math.min(100, (meta.guardado / meta.alvo) * 100); return <article className="goal-card" key={meta.id}><div className="goal-top"><span style={{ background: meta.cor }}><Flag size={18} /></span><button onClick={() => setMetas((m) => m.filter((x) => x.id !== meta.id))}><Trash2 size={15} /></button></div><input className="goal-title" value={meta.titulo} onChange={(e) => atualizar(meta.id, "titulo", e.target.value)} /><div className="goal-values"><label>Já guardei<input type="number" value={meta.guardado} onChange={(e) => atualizar(meta.id, "guardado", Number(e.target.value))} /></label><label>Minha meta<input type="number" value={meta.alvo} onChange={(e) => atualizar(meta.id, "alvo", Number(e.target.value))} /></label></div><div className="budget-track"><span style={{ width: `${progresso}%`, background: meta.cor }} /></div><div className="goal-foot"><strong>{progresso.toFixed(0)}% completo</strong><span>Faltam {formatar(Math.max(0, meta.alvo - meta.guardado))}</span></div></article>; })}</div></section>;
}
