
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StudentData {
  id: string;
  nome: string;
  codigo: string;
  curso: string;
  turma: string;
  idade: number;
}

interface Nota {
  id: string;
  trimestre: number;
  prova_professor: number;
  prova_final: number;
  media_final: number;
  disciplina_nome: string;
  disciplina_codigo: string;
}

interface Schedule {
  id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplina_nome: string;
  disciplina_codigo: string;
}

export const useStudentData = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [notas, setNotas] = useState<Nota[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const sessionToken = localStorage.getItem('studentSessionToken');
      const studentDataStr = localStorage.getItem('studentData');
      
      if (!sessionToken || !studentDataStr) {
        navigate('/');
        return;
      }

      const parsedStudentData = JSON.parse(studentDataStr);
      setStudentData(parsedStudentData);
      loadStudentData(sessionToken, parsedStudentData);
    };

    checkAuth();
  }, [navigate]);

  const loadStudentData = async (sessionToken: string, student: StudentData) => {
    try {
      // Carregar notas trimestrais
      const { data: notasData, error: notasError } = await supabase
        .from('notas')
        .select(`
          id,
          trimestre,
          prova_professor,
          prova_final,
          media_final,
          disciplinas!notas_disciplina_id_fkey (nome, codigo)
        `)
        .not('trimestre', 'is', null)
        .eq('aluno_id', student.id);

      if (notasError) throw notasError;
      
      // Transformar dados das notas para o formato esperado
      const notasFormatted = notasData?.map(nota => ({
        id: nota.id,
        trimestre: nota.trimestre,
        prova_professor: nota.prova_professor,
        prova_final: nota.prova_final,
        media_final: nota.media_final,
        disciplina_nome: (nota.disciplinas as any)?.nome || '',
        disciplina_codigo: (nota.disciplinas as any)?.codigo || ''
      })) || [];

      setNotas(notasFormatted);

      // Carregar horários da turma
      const { data: horariosData, error: horariosError } = await supabase
        .from('horarios')
        .select(`
          id,
          dia,
          inicio,
          fim,
          turma,
          disciplinas!horarios_disciplina_id_fkey (nome, codigo)
        `)
        .eq('turma', student.turma);

      if (horariosError) throw horariosError;

      // Transformar dados dos horários para o formato esperado
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
        description: "Erro ao carregar dados do aluno",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentSessionToken');
    localStorage.removeItem('studentData');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso"
    });
    navigate('/');
  };

  return {
    studentData,
    notas,
    schedule,
    isLoading,
    handleLogout
  };
};
