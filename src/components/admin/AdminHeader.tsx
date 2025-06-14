
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import InstallButton from '@/components/InstallButton';

const AdminHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso"
      });
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro",
        description: "Erro ao fazer logout",
        variant: "destructive"
      });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <InstallButton />
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
  );
};

export default AdminHeader;
