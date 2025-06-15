
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkAdminUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && mounted) {
        navigate('/admin-panel');
      }
    };
    checkAdminUser();
    return () => { mounted = false; };
  }, [navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoading(true);
    setAdminError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminPassword
      });

      if (error) {
        if (error.message?.includes('Invalid login credentials')) {
          throw new Error('Email ou senha incorretos.');
        }
        throw error;
      }

      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo."
      });
      navigate('/admin-panel');
    } catch (error: any) {
      const errorMessage = error.message || "Erro na autenticação";
      setAdminError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Painel Administrativo</CardTitle>
          <p className="text-gray-600 mt-2">Acesse o painel de gestão</p>
        </CardHeader>
        <CardContent>
          {adminError && (
            <Alert className="mb-4" variant="destructive">
              <AlertDescription>{adminError}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="Digite seu email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="pl-10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input id="adminPassword" type={showAdminPassword ? "text" : "password"} placeholder="Digite sua senha" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowAdminPassword(!showAdminPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isAdminLoading}>
              {isAdminLoading ? 'Processando...' : 'Entrar'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" className="text-sm" onClick={() => navigate('/login')}>
              Sou Aluno? Acessar portal do aluno
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
