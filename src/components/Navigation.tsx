
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  HelpCircle,
  User,
  Calendar,
  Download
} from 'lucide-react';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { label: 'Início', path: '/dashboard', icon: Home },
    { label: 'Perfil', path: '/profile', icon: User },
    { label: 'Horários', path: '/schedule', icon: Calendar },
    { label: 'Notas', path: '/grades', icon: FileText },
    { label: 'Materiais', path: '/materials', icon: Download },
    { label: 'Disciplinas', path: '/subjects', icon: BookOpen },
    { label: 'Candidaturas', path: '/applications', icon: GraduationCap },
    { label: 'Ajuda', path: '/help', icon: HelpCircle },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Portal Acadêmico</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Menu mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              Menu
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
