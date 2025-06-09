
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminErrorStateProps {
  error: string;
  onReturnToLogin: () => void;
}

const AdminErrorState = ({ error, onReturnToLogin }: AdminErrorStateProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Erro no Painel Administrativo</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={onReturnToLogin}>
          Voltar para o Login
        </Button>
      </div>
    </div>
  );
};

export default AdminErrorState;
