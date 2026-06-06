export const PLANNER_HISTORY_KEY = "planner_history_periods";

export type PlannerPeriod = {
  id: string;
  name: string;
  createdAt: string;
  data: Record<string, string>;
};

function getPlannerKeys() {
  return Object.keys(window.localStorage).filter(
    key => key.startsWith("planner_") && key !== PLANNER_HISTORY_KEY,
  );
}

export function getPlannerHistory(): PlannerPeriod[] {
  try {
    return JSON.parse(window.localStorage.getItem(PLANNER_HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function savePlannerPeriod(name: string): PlannerPeriod[] {
  const data = Object.fromEntries(
    getPlannerKeys().map(key => [key, window.localStorage.getItem(key) || "null"]),
  );
  const period: PlannerPeriod = {
    id: crypto.randomUUID(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    data,
  };
  const history = [period, ...getPlannerHistory()];
  window.localStorage.setItem(PLANNER_HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function clearCurrentPlanner() {
  getPlannerKeys().forEach(key => window.localStorage.removeItem(key));
}

export function restorePlannerPeriod(period: PlannerPeriod) {
  clearCurrentPlanner();
  Object.entries(period.data).forEach(([key, value]) => window.localStorage.setItem(key, value));
}

export function deletePlannerPeriod(id: string): PlannerPeriod[] {
  const history = getPlannerHistory().filter(period => period.id !== id);
  window.localStorage.setItem(PLANNER_HISTORY_KEY, JSON.stringify(history));
  return history;
}
