
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut } from 'lucide-react';
import AlunosTab from '@/components/admin/AlunosTab';
import DisciplinasTab from '@/components/admin/DisciplinasTab';
import NotasTab from '@/components/admin/NotasTab';
import HorariosTab from '@/components/admin/HorariosTab';

const AdminPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alunos');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        console.log('AdminPanel: Verificando autenticação...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('AdminPanel: Erro ao verificar sessão:', error);
          throw error;
        }

        if (!session) {
          console.log('AdminPanel: Nenhuma sessão encontrada, redirecionando...');
          if (mounted) {
            navigate('/admin-panel-login');
          }
          return;
        }

        console.log('AdminPanel: Sessão encontrada:', session.user.email);
        if (mounted) {
          setUser(session.user);
          setIsLoading(false);
          setError(null);
        }
      } catch (error: any) {
        console.error('AdminPanel: Erro na verificação de auth:', error);
        if (mounted) {
          setError(error.message || 'Erro ao verificar autenticação');
          setIsLoading(false);
          toast({
            title: "Erro",
            description: "Erro ao verificar autenticação",
            variant: "destructive"
          });
          // Não redirecionar imediatamente para permitir que o usuário veja o erro
          setTimeout(() => {
            navigate('/admin-panel-login');
          }, 2000);
        }
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AdminPanel: Auth state changed:', event, session?.user?.email);
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        navigate('/admin-panel-login');
      } else if (session) {
        setUser(session.user);
        setIsLoading(false);
        setError(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      console.log('AdminPanel: Fazendo logout...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
      navigate('/admin-panel-login');
    } catch (error: any) {
      console.error('AdminPanel: Erro no logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Erro no Painel Administrativo</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/admin-panel-login')}>
            Voltar para o Login
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecionando para login...</p>
        </div>
      </div>
    );
  }

  console.log('AdminPanel: Renderizando painel principal para:', user.email);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Painel Administrativo</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bem-vindo, {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">Gerencie alunos, disciplinas, horários e notas</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="alunos">Alunos</TabsTrigger>
            <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
            <TabsTrigger value="horarios">Horários</TabsTrigger>
            <TabsTrigger value="notas">Notas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="alunos" className="mt-6">
            <AlunosTab />
          </TabsContent>
          
          <TabsContent value="disciplinas" className="mt-6">
            <DisciplinasTab />
          </TabsContent>
          
          <TabsContent value="horarios" className="mt-6">
            <HorariosTab />
          </TabsContent>
          
          <TabsContent value="notas" className="mt-6">
            <NotasTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
