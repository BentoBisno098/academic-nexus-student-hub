
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Logo PAC no canto superior esquerdo como barra fixa */}
      <div className="fixed top-0 left-0 z-50 bg-white shadow-md">
        <img 
          src="/lovable-uploads/d764889b-9997-433e-9334-393bf0086de7.png" 
          alt="Logo PAC" 
          className="w-20 h-16 object-contain p-2"
        />
      </div>

      <div className="w-full max-w-4xl flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistema Acadêmico</h1>
          <p className="text-xl text-gray-600">Gerencie alunos, disciplinas, notas e horários de forma simples e eficiente</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Acesso do Aluno</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Acesse suas notas, horários e informações acadêmicas
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                className="w-full"
              >
                Login do Aluno
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <GraduationCap className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Painel Administrativo</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Gerencie alunos, disciplinas, notas e horários do sistema
              </p>
              <Button 
                onClick={() => navigate('/auth-login')} 
                variant="outline"
                className="w-full"
              >
                Login Administrativo
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Sistema desenvolvido para gestão acadêmica completa
          </p>
        </div>
      </div>

      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Criado Por Simão Miguel Mbachi
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Agradecimentos Rosa De Jesus Mbachi
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Contactos: +244 927 464 676/ +244 924 066 616
        </p>
      </footer>
    </div>
  );
};

export default Index;
