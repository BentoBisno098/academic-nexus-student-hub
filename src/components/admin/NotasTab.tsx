
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Nota, Aluno, Disciplina, NotaFormData } from './notas/types';
import { loadNotasData, saveNota, deleteNota } from './notas/notaUtils';
import NotaForm from './notas/NotaForm';
import NotasTable from './notas/NotasTable';

const NotasTab = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tipoNota, setTipoNota] = useState<'tradicional' | 'trimestral'>('tradicional');
  const [formData, setFormData] = useState<NotaFormData>({
    aluno_id: '',
    disciplina_id: '',
    prova1: '',
    prova2: '',
    trabalho: '',
    trimestre: '',
    prova_professor: '',
    prova_final: '',
    ano_letivo: new Date().getFullYear().toString()
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await loadNotasData();
      setNotas(data.notas);
      setAlunos(data.alunos);
      setDisciplinas(data.disciplinas);
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
      const action = await saveNota(formData, tipoNota, editingId);
      toast({ 
        title: "Sucesso", 
        description: `Nota ${action} com sucesso!` 
      });
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

  const handleEdit = (nota: Nota) => {
    const isTradicional = nota.prova1 !== null || nota.prova2 !== null || nota.trabalho !== null;
    setTipoNota(isTradicional ? 'tradicional' : 'trimestral');
    
    setFormData({
      aluno_id: nota.aluno_id,
      disciplina_id: nota.disciplina_id,
      prova1: nota.prova1?.toString() || '',
      prova2: nota.prova2?.toString() || '',
      trabalho: nota.trabalho?.toString() || '',
      trimestre: nota.trimestre?.toString() || '',
      prova_professor: nota.prova_professor?.toString() || '',
      prova_final: nota.prova_final?.toString() || '',
      ano_letivo: nota.ano_letivo?.toString() || new Date().getFullYear().toString()
    });
    setEditingId(nota.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta nota?')) return;

    try {
      await deleteNota(id);
      toast({ title: "Sucesso", description: "Nota excluída com sucesso!" });
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
    setFormData({
      aluno_id: '',
      disciplina_id: '',
      prova1: '',
      prova2: '',
      trabalho: '',
      trimestre: '',
      prova_professor: '',
      prova_final: '',
      ano_letivo: new Date().getFullYear().toString()
    });
    setEditingId(null);
    setShowForm(false);
    setTipoNota('tradicional');
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando notas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Notas</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota
        </Button>
      </div>

      {showForm && (
        <NotaForm
          formData={formData}
          setFormData={setFormData}
          alunos={alunos}
          disciplinas={disciplinas}
          tipoNota={tipoNota}
          setTipoNota={setTipoNota}
          editingId={editingId}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <NotasTable
        notas={notas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default NotasTab;
