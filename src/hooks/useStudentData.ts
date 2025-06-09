
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

export const useStudentData = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [notas, setNotas] = useState<Nota[]>([]);
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

      setStudentData(JSON.parse(studentDataStr));
      loadStudentData(sessionToken);
    };

    checkAuth();
  }, [navigate]);

  const loadStudentData = async (sessionToken: string) => {
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
        .eq('aluno_id', JSON.parse(localStorage.getItem('studentData') || '{}').id);

      if (notasError) throw notasError;
      
      // Transformar dados para o formato esperado
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
    isLoading,
    handleLogout
  };
};
