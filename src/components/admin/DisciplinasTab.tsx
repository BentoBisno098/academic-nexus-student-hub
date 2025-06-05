
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DisciplinaForm from './disciplinas/DisciplinaForm';
import HorarioForm from './disciplinas/HorarioForm';
import DisciplinasList from './disciplinas/DisciplinasList';
import { Disciplina, Horario } from './disciplinas/types';

const DisciplinasTab = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHorarioForm, setShowHorarioForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingHorarioId, setEditingHorarioId] = useState<string | null>(null);
  const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    professor: ''
  });
  const [horarioFormData, setHorarioFormData] = useState({
    disciplina_id: '',
    dia: '',
    inicio: '',
    fim: '',
    sala: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar disciplinas
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('*')
        .order('nome');

      if (disciplinasError) throw disciplinasError;

      // Carregar horários
      const { data: horariosData, error: horariosError } = await supabase
        .from('horarios')
        .select('*')
        .order('dia', { ascending: true });

      if (horariosError) throw horariosError;

      setDisciplinas(disciplinasData || []);
      setHorarios(horariosData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('disciplinas')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Disciplina atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('disciplinas')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Disciplina adicionada com sucesso!" });
      }

      resetForm();
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleHorarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar horários duplicados
      const duplicado = horarios.find(h => 
        h.id !== editingHorarioId &&
        h.disciplina_id === horarioFormData.disciplina_id &&
        h.dia === horarioFormData.dia &&
        ((horarioFormData.inicio >= h.inicio && horarioFormData.inicio < h.fim) ||
         (horarioFormData.fim > h.inicio && horarioFormData.fim <= h.fim) ||
         (horarioFormData.inicio <= h.inicio && horarioFormData.fim >= h.fim))
      );

      if (duplicado) {
        toast({
          title: "Erro",
          description: "Já existe um horário para esta disciplina neste dia e horário",
          variant: "destructive"
        });
        return;
      }

      const horarioData = {
        disciplina_id: horarioFormData.disciplina_id,
        dia: horarioFormData.dia,
        inicio: horarioFormData.inicio,
        fim: horarioFormData.fim,
        sala: horarioFormData.sala || null
      };

      if (editingHorarioId) {
        const { error } = await supabase
          .from('horarios')
          .update(horarioData)
          .eq('id', editingHorarioId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('horarios')
          .insert([horarioData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário adicionado com sucesso!" });
      }

      resetHorarioForm();
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (disciplina: Disciplina) => {
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      professor: disciplina.professor || ''
    });
    setEditingId(disciplina.id);
    setShowForm(true);
  };

  const handleEditHorario = (horario: Horario) => {
    setHorarioFormData({
      disciplina_id: horario.disciplina_id,
      dia: horario.dia,
      inicio: horario.inicio,
      fim: horario.fim,
      sala: horario.sala || ''
    });
    setEditingHorarioId(horario.id);
    setShowHorarioForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta disciplina?')) return;

    try {
      const { error } = await supabase
        .from('disciplinas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Disciplina excluída com sucesso!" });
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteHorario = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) return;

    try {
      const { error } = await supabase
        .from('horarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Horário excluído com sucesso!" });
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', codigo: '', professor: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const resetHorarioForm = () => {
    setHorarioFormData({ disciplina_id: '', dia: '', inicio: '', fim: '', sala: '' });
    setEditingHorarioId(null);
    setShowHorarioForm(false);
  };

  const openHorarioForm = (disciplinaId?: string) => {
    if (disciplinaId) {
      setHorarioFormData(prev => ({ ...prev, disciplina_id: disciplinaId }));
    }
    setShowHorarioForm(true);
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando disciplinas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Disciplinas</h3>
        <div className="flex gap-2">
          <Button onClick={() => setShowHorarioForm(true)} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Novo Horário
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Disciplina
          </Button>
        </div>
      </div>

      <DisciplinaForm
        showForm={showForm}
        editingId={editingId}
        formData={formData}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onFormDataChange={setFormData}
        onCancel={resetForm}
      />

      <HorarioForm
        showHorarioForm={showHorarioForm}
        editingHorarioId={editingHorarioId}
        horarioFormData={horarioFormData}
        disciplinas={disciplinas}
        isLoading={isLoading}
        onSubmit={handleHorarioSubmit}
        onFormDataChange={setHorarioFormData}
        onCancel={resetHorarioForm}
      />

      <DisciplinasList
        disciplinas={disciplinas}
        horarios={horarios}
        expandedDisciplina={expandedDisciplina}
        onExpandDisciplina={setExpandedDisciplina}
        onEditDisciplina={handleEdit}
        onDeleteDisciplina={handleDelete}
        onEditHorario={handleEditHorario}
        onDeleteHorario={handleDeleteHorario}
        onOpenHorarioForm={openHorarioForm}
      />
    </div>
  );
};

export default DisciplinasTab;
