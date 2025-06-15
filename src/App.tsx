
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AuthLogin from "./pages/AuthLogin";
import AdminDashboardMain from "./pages/AdminDashboardMain";
import StudentDashboard from "./pages/StudentDashboard";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Grades from "./pages/Grades";
import Subjects from "./pages/Subjects";
import Materials from "./pages/Materials";
import Applications from "./pages/Applications";
import Help from "./pages/Help";
import NewUserGuide from "./pages/NewUserGuide";
import PasswordRecovery from "./pages/PasswordRecovery";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPanel from "./pages/AdminPanel";
import AdminAlunos from "./pages/AdminAlunos";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth-login" element={<AuthLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashboardMain />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/help" element={<Help />} />
          <Route path="/new-user-guide" element={<NewUserGuide />} />
          <Route path="/password-recovery" element={<PasswordRecovery />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard-old" element={<AdminDashboard />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-alunos" element={<AdminAlunos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
