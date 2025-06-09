
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentSchedule {
  id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplina_nome: string;
  disciplina_codigo: string;
}

export const useStudentSchedule = (studentData: any) => {
  const [schedule, setSchedule] = useState<StudentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (studentData?.turma) {
      loadStudentSchedule();
    }
  }, [studentData]);

  const loadStudentSchedule = async () => {
    try {
      const { data: horariosData, error } = await supabase
        .from('horarios')
        .select(`
          id,
          dia,
          inicio,
          fim,
          turma,
          disciplinas!horarios_disciplina_id_fkey (nome, codigo)
        `)
        .eq('turma', studentData.turma);

      if (error) throw error;

      // Transformar dados para o formato esperado
      const horariosFormatted = horariosData?.map(horario => ({
        id: horario.id,
        dia: horario.dia,
        inicio: horario.inicio,
        fim: horario.fim,
        turma: horario.turma,
        disciplina_nome: (horario.disciplinas as any)?.nome || '',
        disciplina_codigo: (horario.disciplinas as any)?.codigo || ''
      })) || [];

      // Ordenar por dia da semana e hora
      const diasOrdem = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
      
      horariosFormatted.sort((a, b) => {
        const diaA = diasOrdem.indexOf(a.dia);
        const diaB = diasOrdem.indexOf(b.dia);
        
        if (diaA !== diaB) {
          return diaA - diaB;
        }
        
        return a.inicio.localeCompare(b.inicio);
      });

      setSchedule(horariosFormatted);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar horários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { schedule, isLoading };
};
