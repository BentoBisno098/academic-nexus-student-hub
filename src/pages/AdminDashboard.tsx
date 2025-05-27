
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, FileText, Calendar } from 'lucide-react';
import AdminNavigation from '@/components/AdminNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalDisciplinas: 0,
    totalNotas: 0,
    totalHorarios: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
        return;
      }
      
      // Load dashboard stats
      loadStats();
    };

    checkAuth();
  }, [navigate]);

  const loadStats = async () => {
    try {
      const [alunos, disciplinas, notas, horarios] = await Promise.all([
        supabase.from('alunos').select('id', { count: 'exact', head: true }),
        supabase.from('disciplinas').select('id', { count: 'exact', head: true }),
        supabase.from('notas').select('id', { count: 'exact', head: true }),
        supabase.from('horarios').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalAlunos: alunos.count || 0,
        totalDisciplinas: disciplinas.count || 0,
        totalNotas: notas.count || 0,
        totalHorarios: horarios.count || 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const dashboardCards = [
    {
      title: 'Total de Alunos',
      value: stats.totalAlunos,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total de Disciplinas',
      value: stats.totalDisciplinas,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Notas Lançadas',
      value: stats.totalNotas,
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Horários Definidos',
      value: stats.totalHorarios,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema de gestão acadêmica</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button 
                onClick={() => navigate('/admin-alunos')}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Gerenciar Alunos</div>
                <div className="text-sm text-gray-500">Adicionar, editar ou remover alunos</div>
              </button>
              <button 
                onClick={() => navigate('/admin-disciplinas')}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Gerenciar Disciplinas</div>
                <div className="text-sm text-gray-500">Adicionar, editar ou remover disciplinas</div>
              </button>
              <button 
                onClick={() => navigate('/admin-notas')}
                className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium">Lançar Notas</div>
                <div className="text-sm text-gray-500">Inserir e editar notas dos alunos</div>
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 border rounded-lg">
                <div className="font-medium text-green-600">Sistema Online</div>
                <div className="text-sm text-gray-500">Todos os serviços funcionando normalmente</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">Banco de Dados</div>
                <div className="text-sm text-gray-500">Conectado ao Supabase</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
