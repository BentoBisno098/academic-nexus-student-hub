
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Help from "./pages/Help";
import PasswordRecovery from "./pages/PasswordRecovery";
import NewUserGuide from "./pages/NewUserGuide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/new-user-guide" element={<NewUserGuide />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/help" element={<Help />} />
          {/* Placeholder routes for future development */}
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/schedule" element={<Dashboard />} />
          <Route path="/grades" element={<Dashboard />} />
          <Route path="/materials" element={<Dashboard />} />
          <Route path="/subjects" element={<Dashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
