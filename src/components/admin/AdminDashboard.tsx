
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AlunosTab from '@/components/admin/AlunosTab';
import DisciplinasTab from '@/components/admin/DisciplinasTab';
import NotasTab from '@/components/admin/NotasTab';
import HorariosTab from '@/components/admin/HorariosTab';
import PeriodosTab from '@/components/admin/PeriodosTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('alunos');

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Gerencie alunos, disciplinas, notas, horários e períodos</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="alunos">Alunos</TabsTrigger>
          <TabsTrigger value="disciplinas">Disciplinas</TabsTrigger>
          <TabsTrigger value="notas">Notas</TabsTrigger>
          <TabsTrigger value="horarios">Horários</TabsTrigger>
          <TabsTrigger value="periodos">Períodos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alunos" className="mt-6">
          <AlunosTab />
        </TabsContent>
        
        <TabsContent value="disciplinas" className="mt-6">
          <DisciplinasTab />
        </TabsContent>
        
        <TabsContent value="notas" className="mt-6">
          <NotasTab />
        </TabsContent>
        
        <TabsContent value="horarios" className="mt-6">
          <HorariosTab />
        </TabsContent>
        
        <TabsContent value="periodos" className="mt-6">
          <PeriodosTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
