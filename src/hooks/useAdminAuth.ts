
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  return {
    user,
    isLoading,
    error,
    handleLogout
  };
};
