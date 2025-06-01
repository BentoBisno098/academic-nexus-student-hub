
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Horario, Disciplina, HorarioFormData } from './types';

export const useHorarios = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [filteredHorarios, setFilteredHorarios] = useState<Horario[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterTurma, setFilterTurma] = useState('');
  const [formData, setFormData] = useState<HorarioFormData>({
    dia: '',
    inicio: '',
    fim: '',
    turma: '',
    disciplina_id: ''
  });
  const { toast } = useToast();

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterHorarios();
  }, [horarios, filterTurma]);

  const loadData = async () => {
    try {
      // Carregar horários com joins usando a relação correta
      const { data: horariosData, error: horariosError } = await supabase
        .from('horarios')
        .select(`
          *,
          disciplinas!horarios_disciplina_id_fkey(nome, codigo)
        `)
        .order('dia')
        .order('inicio');

      if (horariosError) throw horariosError;

      // Carregar disciplinas
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('id, nome, codigo')
        .order('nome');

      if (disciplinasError) throw disciplinasError;

      setHorarios(horariosData || []);
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

  const filterHorarios = () => {
    let filtered = horarios;

    if (filterTurma) {
      filtered = filtered.filter(horario => horario.turma === filterTurma);
    }

    // Ordenar por dia da semana e hora
    filtered.sort((a, b) => {
      const diaA = diasSemana.indexOf(a.dia);
      const diaB = diasSemana.indexOf(b.dia);
      if (diaA !== diaB) return diaA - diaB;
      return a.inicio.localeCompare(b.inicio);
    });

    setFilteredHorarios(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const horarioData = {
        dia: formData.dia,
        inicio: formData.inicio,
        fim: formData.fim,
        turma: formData.turma,
        disciplina_id: formData.disciplina_id
      };

      if (editingId) {
        const { error } = await supabase
          .from('horarios')
          .update(horarioData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('horarios')
          .insert([horarioData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário adicionado com sucesso!" });
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

  const handleEdit = (horario: Horario) => {
    setFormData({
      dia: horario.dia,
      inicio: horario.inicio,
      fim: horario.fim,
      turma: horario.turma,
      disciplina_id: horario.disciplina_id
    });
    setEditingId(horario.id);
  };

  const handleDelete = async (id: string) => {
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
    setFormData({
      dia: '',
      inicio: '',
      fim: '',
      turma: '',
      disciplina_id: ''
    });
    setEditingId(null);
  };

  const uniqueTurmas = [...new Set(horarios.map(h => h.turma).filter(Boolean))];

  return {
    horarios,
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
  };
};
