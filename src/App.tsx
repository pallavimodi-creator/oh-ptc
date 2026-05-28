import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AppLayout } from "./components/AppLayout";
import Login from "./pages/Login";
import Calendar from "./pages/Calendar";
import SessionPlan from "./pages/SessionPlan";
import Onboarding from "./pages/Onboarding";
import AdminDashboard from "./pages/AdminDashboard";
import Scheduler from "./pages/Scheduler";
import TrainerDashboard from "./pages/TrainerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/session/:id" element={<SessionPlan />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/trainer" element={<TrainerDashboard />} />
            </Route>
            <Route path="/" element={<Navigate to="/calendar" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
