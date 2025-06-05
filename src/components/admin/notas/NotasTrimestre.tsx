
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Aluno {
  id: string;
  nome: string;
  codigo: string;
  turma: string;
}

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
}

interface NotaTrimestre {
  trimestre: number;
  prova_professor: number | null;
  prova_final: number | null;
}

interface NotasData {
  [key: string]: { // aluno_id-disciplina_id
    [trimestre: number]: NotaTrimestre;
  };
}

const NotasTrimestre = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [selectedAluno, setSelectedAluno] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [notasData, setNotasData] = useState<NotasData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [anoLetivo, setAnoLetivo] = useState(new Date().getFullYear().toString());
  const { toast } = useToast();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedAluno && selectedDisciplina) {
      loadNotasForAlunoAndDisciplina();
    }
  }, [selectedAluno, selectedDisciplina, anoLetivo]);

  const loadInitialData = async () => {
    try {
      // Carregar alunos
      const { data: alunosData, error: alunosError } = await supabase
        .from('alunos')
        .select('id, nome, codigo, turma')
        .order('nome');

      if (alunosError) throw alunosError;

      // Carregar disciplinas
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('id, nome, codigo')
        .order('nome');

      if (disciplinasError) throw disciplinasError;

      setAlunos(alunosData || []);
      setDisciplinas(disciplinasData || []);
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados iniciais",
        variant: "destructive"
      });
    }
  };

  const loadNotasForAlunoAndDisciplina = async () => {
    try {
      const { data: notasExistentes, error } = await supabase
        .from('notas')
        .select('*')
        .eq('aluno_id', selectedAluno)
        .eq('disciplina_id', selectedDisciplina)
        .eq('ano_letivo', parseInt(anoLetivo))
        .not('trimestre', 'is', null);

      if (error) throw error;

      const key = `${selectedAluno}-${selectedDisciplina}`;
      const notasObj: { [trimestre: number]: NotaTrimestre } = {};

      // Inicializar com valores vazios para os 3 trimestres
      [1, 2, 3].forEach(trimestre => {
        notasObj[trimestre] = {
          trimestre,
          prova_professor: null,
          prova_final: null
        };
      });

      // Preencher com dados existentes
      notasExistentes?.forEach(nota => {
        if (nota.trimestre) {
          notasObj[nota.trimestre] = {
            trimestre: nota.trimestre,
            prova_professor: nota.prova_professor,
            prova_final: nota.prova_final
          };
        }
      });

      setNotasData(prev => ({
        ...prev,
        [key]: notasObj
      }));
    } catch (error: any) {
      console.error('Erro ao carregar notas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar notas existentes",
        variant: "destructive"
      });
    }
  };

  const updateNota = (trimestre: number, field: 'prova_professor' | 'prova_final', value: string) => {
    const key = `${selectedAluno}-${selectedDisciplina}`;
    const numValue = value === '' ? null : parseFloat(value);
    
    // Validar se está entre 0 e 20
    if (numValue !== null && (numValue < 0 || numValue > 20)) {
      toast({
        title: "Valor inválido",
        description: "As notas devem estar entre 0 e 20",
        variant: "destructive"
      });
      return;
    }

    setNotasData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [trimestre]: {
          ...prev[key]?.[trimestre],
          trimestre,
          [field]: numValue
        }
      }
    }));
  };

  const salvarNotas = async () => {
    if (!selectedAluno || !selectedDisciplina) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione um aluno e uma disciplina",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const key = `${selectedAluno}-${selectedDisciplina}`;
      const notasDoAluno = notasData[key];

      if (!notasDoAluno) {
        toast({
          title: "Nenhuma nota",
          description: "Não há notas para salvar",
          variant: "destructive"
        });
        return;
      }

      // Primeiro, deletar notas existentes para este aluno/disciplina/ano
      await supabase
        .from('notas')
        .delete()
        .eq('aluno_id', selectedAluno)
        .eq('disciplina_id', selectedDisciplina)
        .eq('ano_letivo', parseInt(anoLetivo))
        .not('trimestre', 'is', null);

      // Inserir novas notas
      const notasParaInserir = [];
      for (const trimestre of [1, 2, 3]) {
        const notaTrimestre = notasDoAluno[trimestre];
        if (notaTrimestre && (notaTrimestre.prova_professor !== null || notaTrimestre.prova_final !== null)) {
          notasParaInserir.push({
            aluno_id: selectedAluno,
            disciplina_id: selectedDisciplina,
            ano_letivo: parseInt(anoLetivo),
            trimestre: trimestre,
            prova_professor: notaTrimestre.prova_professor,
            prova_final: notaTrimestre.prova_final,
            prova1: null,
            prova2: null,
            trabalho: null
          });
        }
      }

      if (notasParaInserir.length > 0) {
        const { error } = await supabase
          .from('notas')
          .insert(notasParaInserir);

        if (error) throw error;
      }

      toast({
        title: "Sucesso",
        description: "Notas salvas com sucesso!"
      });

    } catch (error: any) {
      console.error('Erro ao salvar notas:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar notas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getColorForTrimestre = (trimestre: number) => {
    switch (trimestre) {
      case 1: return 'border-blue-500';
      case 2: return 'border-green-500';
      case 3: return 'border-red-500';
      default: return 'border-gray-500';
    }
  };

  const getIconForTrimestre = (trimestre: number) => {
    switch (trimestre) {
      case 1: return '🟦';
      case 2: return '🟩';
      case 3: return '🟥';
      default: return '⬜';
    }
  };

  const selectedAlunoData = alunos.find(a => a.id === selectedAluno);
  const selectedDisciplinaData = disciplinas.find(d => d.id === selectedDisciplina);
  const key = `${selectedAluno}-${selectedDisciplina}`;
  const notasDoAluno = notasData[key];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sistema de Notas por Trimestre</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Aluno</Label>
              <Select value={selectedAluno} onValueChange={setSelectedAluno}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map(aluno => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome} ({aluno.codigo}) - {aluno.turma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Disciplina</Label>
              <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {disciplinas.map(disciplina => (
                    <SelectItem key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome} ({disciplina.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Ano Letivo</Label>
              <Input
                type="number"
                min="2020"
                max="2030"
                value={anoLetivo}
                onChange={(e) => setAnoLetivo(e.target.value)}
              />
            </div>
          </div>

          {selectedAlunoData && selectedDisciplinaData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">
                Aluno: {selectedAlunoData.nome} ({selectedAlunoData.codigo}) | 
                Disciplina: {selectedDisciplinaData.nome} ({selectedDisciplinaData.codigo})
              </h3>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAluno && selectedDisciplina && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(trimestre => (
            <Card key={trimestre} className={`border-2 ${getColorForTrimestre(trimestre)}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{getIconForTrimestre(trimestre)}</span>
                  {trimestre}º Trimestre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`prof_${trimestre}`}>Prova do Professor (0-20)</Label>
                  <Input
                    id={`prof_${trimestre}`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={notasDoAluno?.[trimestre]?.prova_professor || ''}
                    onChange={(e) => updateNota(trimestre, 'prova_professor', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor={`final_${trimestre}`}>Prova Final (0-20)</Label>
                  <Input
                    id={`final_${trimestre}`}
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={notasDoAluno?.[trimestre]?.prova_final || ''}
                    onChange={(e) => updateNota(trimestre, 'prova_final', e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                {notasDoAluno?.[trimestre]?.prova_professor !== null && 
                 notasDoAluno?.[trimestre]?.prova_final !== null && (
                  <div className="pt-2">
                    <Label>Média do Trimestre:</Label>
                    <Badge variant="outline" className="ml-2">
                      {(((notasDoAluno[trimestre].prova_professor || 0) + 
                         (notasDoAluno[trimestre].prova_final || 0)) / 2).toFixed(1)}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedAluno && selectedDisciplina && (
        <div className="flex justify-center">
          <Button 
            onClick={salvarNotas} 
            disabled={isLoading}
            size="lg"
            className="px-8"
          >
            {isLoading ? 'Salvando...' : 'Salvar Notas'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotasTrimestre;
