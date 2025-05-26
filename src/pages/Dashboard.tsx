
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarInitials } from '@/components/ui/avatar';
import { 
  User, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Users, 
  Calendar,
  Download,
  LogOut,
  Bell
} from 'lucide-react';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState({
    name: "Ana Silva",
    studentNumber: "1234567890",
    course: "Engenharia Informática",
    year: "3º Ano",
    email: "ana.silva@estudante.universidade.pt"
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('studentNumber');
    navigate('/login');
  };

  const quickAccess = [
    {
      title: "Horários",
      description: "Consulte seus horários de aulas",
      icon: Calendar,
      path: "/schedule"
    },
    {
      title: "Notas",
      description: "Visualize suas avaliações",
      icon: FileText,
      path: "/grades"
    },
    {
      title: "Materiais",
      description: "Acesse materiais de apoio",
      icon: Download,
      path: "/materials"
    },
    {
      title: "Candidaturas",
      description: "Candidate-se a cursos",
      icon: GraduationCap,
      path: "/applications"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header com informações do aluno */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Bem-vindo, {studentData.name}
                    </h1>
                    <p className="text-gray-600">
                      {studentData.course} - {studentData.year}
                    </p>
                    <p className="text-sm text-gray-500">
                      Nº: {studentData.studentNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Notificações
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acesso Rápido */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickAccess.map((item, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-6 text-center">
                  <item.icon className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Informações Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Disciplinas Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  "Programação Web Avançada",
                  "Base de Dados II", 
                  "Sistemas Distribuídos",
                  "Inteligência Artificial"
                ].map((subject, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span>{subject}</span>
                    <Button variant="ghost" size="sm">Ver</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">Nova avaliação disponível</p>
                  <p className="text-sm text-gray-600">Programação Web - há 2 dias</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">Material adicionado</p>
                  <p className="text-sm text-gray-600">Sistemas Distribuídos - há 3 dias</p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <p className="font-medium">Prazo de candidatura</p>
                  <p className="text-sm text-gray-600">Mestrado IA - termina em 5 dias</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
