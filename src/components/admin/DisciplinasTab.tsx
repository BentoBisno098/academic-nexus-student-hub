
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import DisciplinaForm from './disciplinas/DisciplinaForm';
import DisciplinasList from './disciplinas/DisciplinasList';
import { Disciplina } from './disciplinas/types';

const DisciplinasTab = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    professor: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar apenas disciplinas
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('*')
        .order('nome');

      if (disciplinasError) throw disciplinasError;

      setDisciplinas(disciplinasData || []);
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

  const handleEdit = (disciplina: Disciplina) => {
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      professor: disciplina.professor || ''
    });
    setEditingId(disciplina.id);
    setShowForm(true);
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

  const resetForm = () => {
    setFormData({ nome: '', codigo: '', professor: '' });
    setEditingId(null);
    setShowForm(false);
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando disciplinas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Disciplinas</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Disciplina
        </Button>
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

      <DisciplinasList
        disciplinas={disciplinas}
        onEditDisciplina={handleEdit}
        onDeleteDisciplina={handleDelete}
      />
    </div>
  );
};

export default DisciplinasTab;
