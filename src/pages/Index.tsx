
import React from 'react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          {/* Logo PAC centralizada acima do título */}
          <img 
            src="/lovable-uploads/d764889b-9997-433e-9334-393bf0086de7.png" 
            alt="Logo PAC" 
            className="w-20 h-16 object-contain mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistema Acadêmico</h1>
          <p className="text-xl text-gray-600">Gerencie alunos, disciplinas, notas e horários de forma simples e eficiente</p>
        </div>
        
        {/* Cards de login removidos para deixar sem navegação */}
        
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

