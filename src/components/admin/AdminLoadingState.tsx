
import React from 'react';

interface AdminLoadingStateProps {
  message?: string;
}

const AdminLoadingState = ({ message = "Carregando painel administrativo..." }: AdminLoadingStateProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default AdminLoadingState;
