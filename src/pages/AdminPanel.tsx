
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminErrorState from '@/components/admin/AdminErrorState';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isLoading, error, handleLogout } = useAdminAuth();

  if (error) {
    return (
      <AdminErrorState 
        error={error} 
        onReturnToLogin={() => navigate('/login')} 
      />
    );
  }

  if (isLoading) {
    return <AdminLoadingState />;
  }

  if (!user) {
    return (
      <AdminLoadingState message="Redirecionando para login..." />
    );
  }

  console.log('AdminPanel: Renderizando painel principal para:', user.email);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        onLogout={handleLogout} 
      />
      <AdminDashboard />
    </div>
  );
};

export default AdminPanel;
