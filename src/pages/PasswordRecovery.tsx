
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const PasswordRecovery = () => {
  const [step, setStep] = useState(1);
  const [studentNumber, setStudentNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (studentNumber.length !== 10 || !/^\d+$/.test(studentNumber)) {
      toast({
        title: "Erro de Validação",
        description: "O número de aluno deve conter exatamente 10 dígitos.",
        variant: "destructive"
      });
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular envio de email
    setTimeout(() => {
      toast({
        title: "Email Enviado",
        description: "Instruções para recuperação da palavra-chave foram enviadas para seu email."
      });
      setStep(3);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="absolute left-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Recuperar Palavra-chave
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {step === 1 && "Digite seu número de aluno"}
            {step === 2 && "Confirme seu email institucional"}
            {step === 3 && "Verifique seu email"}
          </p>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-4">
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
              <Button type="submit" className="w-full">
                Continuar
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Institucional</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@estudante.universidade.pt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Alert>
                <AlertDescription>
                  Confirme o email associado ao número de aluno {studentNumber}
                </AlertDescription>
              </Alert>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Instruções'}
              </Button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-800 font-medium">Email enviado com sucesso!</p>
                <p className="text-green-600 text-sm mt-2">
                  Verifique sua caixa de entrada e pasta de spam.
                </p>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p>As instruções foram enviadas para:</p>
                <p className="font-mono bg-gray-100 px-2 py-1 rounded">{email}</p>
              </div>

              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          )}

          {step < 3 && (
            <div className="mt-6 text-center">
              <Alert>
                <AlertDescription>
                  Certifique-se de que possui acesso ao seu email institucional antes de continuar.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordRecovery;
