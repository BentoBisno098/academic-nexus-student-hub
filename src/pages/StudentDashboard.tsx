import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, FileText, User } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

const StudentDashboard = () => {
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

  const getStatusColor = (media: number) => {
    if (media >= 16) return 'bg-green-500';
    if (media >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">Portal do Aluno</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bem-vindo, {studentData?.nome}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Informações do Aluno */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{studentData?.nome}</h2>
                <p className="text-gray-600">Código: {studentData?.codigo}</p>
                <p className="text-gray-600">{studentData?.curso} - {studentData?.turma}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas Trimestrais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Minhas Notas Trimestrais
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notas.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhuma nota encontrada</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Trimestre</TableHead>
                    <TableHead>Prova Professor</TableHead>
                    <TableHead>Prova Final</TableHead>
                    <TableHead>Média</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notas.map((nota) => (
                    <TableRow key={nota.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{nota.disciplina_nome}</p>
                          <p className="text-sm text-gray-500">{nota.disciplina_codigo}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-purple-600">
                          {nota.trimestre}º Trim
                        </Badge>
                      </TableCell>
                      <TableCell>{nota.prova_professor?.toFixed(1) || '-'}</TableCell>
                      <TableCell>{nota.prova_final?.toFixed(1) || '-'}</TableCell>
                      <TableCell>
                        <Badge 
                          className={`${getStatusColor(nota.media_final || 0)} text-white`}
                        >
                          {nota.media_final?.toFixed(1) || '-'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
