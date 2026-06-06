import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import PlannerSonhos from "./pages/PlannerSonhos";

export default function App() {
  return (
    <ErrorBoundary>
      <TooltipProvider>
        <Toaster />
        <PlannerSonhos />
      </TooltipProvider>
    </ErrorBoundary>
  );
}
