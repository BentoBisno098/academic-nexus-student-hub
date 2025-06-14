import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminPanelLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const checkUser = async () => {
      try {
        console.log('AdminPanelLogin: Verificando se usuário já está logado...');
        
        // Adicionar timeout para evitar requests infinitos
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na verificação de sessão')), 10000)
        );

        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('AdminPanelLogin: Erro ao verificar sessão:', error);
          // Se há erro de conectividade, não bloquear a página
          if (error.message?.includes('Failed to fetch')) {
            console.log('AdminPanelLogin: Erro de conectividade detectado, permitindo acesso ao formulário');
            setError('Erro de conectividade. Tente fazer login mesmo assim.');
          } else {
            setError(error.message);
          }
        }
        
        if (session && mounted) {
          console.log('AdminPanelLogin: Usuário já logado, redirecionando...');
          navigate('/admin-panel');
          return;
        }
      } catch (error: any) {
        console.error('AdminPanelLogin: Erro na verificação:', error);
        if (mounted) {
          if (error.message?.includes('Timeout') || error.message?.includes('Failed to fetch')) {
            setError('Problema de conectividade. Você ainda pode tentar fazer login.');
          } else {
            setError(error.message || 'Erro ao verificar autenticação');
          }
        }
      } finally {
        if (mounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkUser();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('AdminPanelLogin: Tentando fazer login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Tratar erros específicos
        if (error.message?.includes('Failed to fetch')) {
          throw new Error('Erro de conectividade. Verifique sua conexão com a internet.');
        }
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos.');
        }
        throw error;
      }

      console.log('AdminPanelLogin: Login bem-sucedido, redirecionando...');
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo."
      });
      navigate('/admin-panel');
    } catch (error: any) {
      console.error('AdminPanelLogin: Erro de autenticação:', error);
      const errorMessage = error.message || "Erro na autenticação";
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center justify-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Login de Alunos</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Painel Administrativo
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Acesse o painel de gestão
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Digite seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Processando...' : 'Entrar'}
              </Button>
            </form>

            <Alert className="mt-4">
              <AlertDescription>
                <strong>Info:</strong> Entre com suas credenciais de administrador.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanelLogin;
