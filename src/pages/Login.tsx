
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Lock, GraduationCap, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Login = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('aluno_login', {
        p_codigo: studentNumber,
        p_senha: password
      });

      if (error) throw error;

      const result = data[0];
      if (result.success) {
        localStorage.setItem('studentSessionToken', result.session_token);
        localStorage.setItem('studentData', JSON.stringify(result.aluno));
        toast({
          title: "Login realizado",
          description: result.message
        });
        navigate('/student-dashboard');
      } else {
        toast({
          title: "Erro de Autenticação",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Portal do Aluno
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Acesse sua conta de estudante
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentNumber">Código do Aluno</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="studentNumber"
                    type="text"
                    placeholder="Digite seu código"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
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
                {isLoading ? 'Entrando...' : 'Entrar como Aluno'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/admin-panel-login')}
          >
            <UserCog className="h-4 w-4 mr-2" />
            Painel Admin
          </Button>
        </div>

        <Alert>
          <GraduationCap className="h-4 w-4" />
          <AlertDescription>
            Alunos: usem seu código e senha cadastrados.<br/>
            Administradores: acessem o painel administrativo.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default Login;
