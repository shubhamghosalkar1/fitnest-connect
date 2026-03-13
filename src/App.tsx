import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Layout from "./components/layout/Layout";
import Chatbot from "./components/Chatbot";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Services from "./pages/Services";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import TrainerRegistration from "./pages/TrainerRegistration";
import FindTrainer from "./pages/FindTrainer";
import GymRegistration from "./pages/GymRegistration";
import FindGym from "./pages/FindGym";
import TrainerLogin from "./pages/TrainerLogin";
import TrainerDashboard from "./pages/TrainerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedAdmin = () => {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/admin-login" replace />;
  return <Admin />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/services" element={<Services />} />
              <Route path="/join-trainer" element={<TrainerRegistration />} />
              <Route path="/find-trainer" element={<FindTrainer />} />
              <Route path="/register-gym" element={<GymRegistration />} />
              <Route path="/find-gym" element={<FindGym />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedAdmin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <Chatbot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
