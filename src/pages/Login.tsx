
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação do número de aluno (10 dígitos)
    if (studentNumber.length !== 10 || !/^\d+$/.test(studentNumber)) {
      toast({
        title: "Erro de Validação",
        description: "O número de aluno deve conter exatamente 10 dígitos.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Simular autenticação
    setTimeout(() => {
      if (studentNumber === '1234567890' && password === 'senha123') {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('studentNumber', studentNumber);
        toast({
          title: "Login Realizado",
          description: "Bem-vindo à plataforma acadêmica!"
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro de Autenticação",
          description: "Número de aluno ou palavra-chave incorretos.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Portal Acadêmico
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Acesse sua conta de estudante
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="studentNumber">Número de Aluno</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="studentNumber"
                  type="text"
                  placeholder="Digite seus 10 dígitos"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  className="pl-10"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Palavra-chave</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua palavra-chave"
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
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/password-recovery')}
            >
              Recuperar Palavra-chave
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => navigate('/new-user-guide')}
            >
              Orientações para Novos Utilizadores
            </Button>
          </div>

          <Alert className="mt-4">
            <AlertDescription>
              <strong>Demo:</strong> Use o número 1234567890 e palavra-chave "senha123" para testar.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
