
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import HorarioForm from './horarios/HorarioForm';
import HorarioFilters from './horarios/HorarioFilters';
import HorarioTable from './horarios/HorarioTable';
import { useHorarios } from './horarios/useHorarios';

const HorariosTab = () => {
  const [showForm, setShowForm] = useState(false);
  const {
    filteredHorarios,
    disciplinas,
    isLoading,
    editingId,
    filterTurma,
    formData,
    uniqueTurmas,
    setFilterTurma,
    setFormData,
    handleSubmit,
    handleEdit,
    handleDelete,
    resetForm
  } = useHorarios();

  const handleFormSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    setShowForm(false);
  };

  const handleEdit = (horario: any) => {
    handleEdit(horario);
    setShowForm(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowForm(false);
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando horários...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Horários</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Horário
        </Button>
      </div>

      {showForm && (
        <HorarioForm
          formData={formData}
          setFormData={setFormData}
          disciplinas={disciplinas}
          isLoading={isLoading}
          editingId={editingId}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      )}

      <HorarioFilters
        filterTurma={filterTurma}
        setFilterTurma={setFilterTurma}
        uniqueTurmas={uniqueTurmas}
      />

      <HorarioTable
        horarios={filteredHorarios}
        filterTurma={filterTurma}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default HorariosTab;
