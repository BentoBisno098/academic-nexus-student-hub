
import { supabase } from '@/integrations/supabase/client';
import { Nota, Aluno, Disciplina } from './types';

export const loadNotasData = async () => {
  // Carregar notas trimestrais apenas
  const { data: notasData, error: notasError } = await supabase
    .from('notas')
    .select(`
      *,
      alunos!notas_aluno_id_fkey(nome, codigo),
      disciplinas!notas_disciplina_id_fkey(nome, codigo)
    `)
    .not('trimestre', 'is', null)
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
  return { isTradicional: false, tipo: 'Trimestral' };
};
