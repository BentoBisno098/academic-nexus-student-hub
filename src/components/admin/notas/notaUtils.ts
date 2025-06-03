
import { supabase } from '@/integrations/supabase/client';
import { Nota, Aluno, Disciplina, NotaFormData } from './types';

export const loadNotasData = async () => {
  // Carregar notas com joins usando as relações corretas
  const { data: notasData, error: notasError } = await supabase
    .from('notas')
    .select(`
      *,
      alunos!notas_aluno_id_fkey(nome, codigo),
      disciplinas!notas_disciplina_id_fkey(nome, codigo)
    `)
    .order('created_at', { ascending: false });

  if (notasError) throw notasError;

  // Transformar dados para o formato esperado
  const transformedNotas = notasData?.map(n => ({
    ...n,
    aluno: n.alunos ? {
      nome: n.alunos.nome,
      codigo: n.alunos.codigo
    } : undefined,
    disciplina: n.disciplinas ? {
      nome: n.disciplinas.nome,
      codigo: n.disciplinas.codigo
    } : undefined
  })) || [];

  // Carregar alunos
  const { data: alunosData, error: alunosError } = await supabase
    .from('alunos')
    .select('id, nome, codigo')
    .order('nome');

  if (alunosError) throw alunosError;

  // Carregar disciplinas
  const { data: disciplinasData, error: disciplinasError } = await supabase
    .from('disciplinas')
    .select('id, nome, codigo')
    .order('nome');

  if (disciplinasError) throw disciplinasError;

  return {
    notas: transformedNotas,
    alunos: alunosData || [],
    disciplinas: disciplinasData || []
  };
};

export const saveNota = async (
  formData: NotaFormData, 
  tipoNota: 'tradicional' | 'trimestral', 
  editingId?: string | null
) => {
  const notaData = {
    aluno_id: formData.aluno_id,
    disciplina_id: formData.disciplina_id,
    ano_letivo: parseInt(formData.ano_letivo) || new Date().getFullYear(),
    ...(tipoNota === 'tradicional' ? {
      prova1: parseFloat(formData.prova1) || 0,
      prova2: parseFloat(formData.prova2) || 0,
      trabalho: parseFloat(formData.trabalho) || 0,
      trimestre: null,
      prova_professor: null,
      prova_final: null
    } : {
      trimestre: parseInt(formData.trimestre) || 1,
      prova_professor: parseFloat(formData.prova_professor) || 0,
      prova_final: parseFloat(formData.prova_final) || 0,
      prova1: null,
      prova2: null,
      trabalho: null
    })
  };

  if (editingId) {
    const { error } = await supabase
      .from('notas')
      .update(notaData)
      .eq('id', editingId);
    
    if (error) throw error;
    return 'atualizada';
  } else {
    const { error } = await supabase
      .from('notas')
      .insert([notaData]);
    
    if (error) throw error;
    return 'adicionada';
  }
};

export const deleteNota = async (id: string) => {
  const { error } = await supabase
    .from('notas')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const getStatusColor = (media: number) => {
  if (media >= 16) return 'bg-green-500';
  if (media >= 10) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getTipoNotaBadge = (nota: Nota) => {
  const isTradicional = nota.prova1 !== null || nota.prova2 !== null || nota.trabalho !== null;
  return { isTradicional, tipo: isTradicional ? 'Tradicional' : 'Trimestral' };
};
