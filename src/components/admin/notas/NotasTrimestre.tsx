
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Aluno, Disciplina } from './types';

interface NotaTrimestre {
  id?: string;
  aluno_id: string;
  disciplina_id: string;
  trimestre: number;
  prova_professor: number;
  prova_final: number;
  ano_letivo: number;
}

const NotasTrimestre = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [selectedAluno, setSelectedAluno] = useState('');
  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [anoLetivo, setAnoLetivo] = useState(new Date().getFullYear());
  const [notas, setNotas] = useState<{[key: number]: {prova_professor: string, prova_final: string}}>({
    1: { prova_professor: '', prova_final: '' },
    2: { prova_professor: '', prova_final: '' },
    3: { prova_professor: '', prova_final: '' }
  });
  const [notasExistentes, setNotasExistentes] = useState<NotaTrimestre[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedAluno && selectedDisciplina) {
      loadNotasExistentes();
    }
  }, [selectedAluno, selectedDisciplina, anoLetivo]);

  const loadData = async () => {
    try {
      const [alunosResponse, disciplinasResponse] = await Promise.all([
        supabase.from('alunos').select('id, nome, codigo').order('nome'),
        supabase.from('disciplinas').select('id, nome, codigo').order('nome')
      ]);

      if (alunosResponse.error) throw alunosResponse.error;
      if (disciplinasResponse.error) throw disciplinasResponse.error;

      setAlunos(alunosResponse.data || []);
      setDisciplinas(disciplinasResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados",
        variant: "destructive"
      });
    }
  };

  const loadNotasExistentes = async () => {
    try {
      const { data, error } = await supabase
        .from('notas')
        .select('*')
        .eq('aluno_id', selectedAluno)
        .eq('disciplina_id', selectedDisciplina)
        .eq('ano_letivo', anoLetivo)
        .not('trimestre', 'is', null);

      if (error) throw error;

      setNotasExistentes(data || []);

      // Preencher os campos com notas existentes
      const notasTemp = {
        1: { prova_professor: '', prova_final: '' },
        2: { prova_professor: '', prova_final: '' },
        3: { prova_professor: '', prova_final: '' }
      };

      data?.forEach(nota => {
        if (nota.trimestre && nota.trimestre >= 1 && nota.trimestre <= 3) {
          notasTemp[nota.trimestre] = {
            prova_professor: nota.prova_professor?.toString() || '',
            prova_final: nota.prova_final?.toString() || ''
          };
        }
      });

      setNotas(notasTemp);
    } catch (error) {
      console.error('Erro ao carregar notas existentes:', error);
    }
  };

  const handleNotaChange = (trimestre: number, campo: 'prova_professor' | 'prova_final', valor: string) => {
    // Validar se o valor está entre 0 e 20
    const numeroValor = parseFloat(valor);
    if (valor !== '' && (isNaN(numeroValor) || numeroValor < 0 || numeroValor > 20)) {
      toast({
        title: "Erro",
        description: "As notas devem estar entre 0 e 20",
        variant: "destructive"
      });
      return;
    }

    setNotas(prev => ({
      ...prev,
      [trimestre]: {
        ...prev[trimestre],
        [campo]: valor
      }
    }));
  };

  const handleSalvarNotas = async () => {
    if (!selectedAluno || !selectedDisciplina) {
      toast({
        title: "Erro",
        description: "Selecione um aluno e uma disciplina",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Deletar notas existentes primeiro
      await supabase
        .from('notas')
        .delete()
        .eq('aluno_id', selectedAluno)
        .eq('disciplina_id', selectedDisciplina)
        .eq('ano_letivo', anoLetivo)
        .not('trimestre', 'is', null);

      // Inserir novas notas
      const notasParaInserir = [];
      
      for (let trimestre = 1; trimestre <= 3; trimestre++) {
        const nota = notas[trimestre];
        if (nota.prova_professor !== '' || nota.prova_final !== '') {
          notasParaInserir.push({
            aluno_id: selectedAluno,
            disciplina_id: selectedDisciplina,
            trimestre: trimestre,
            prova_professor: parseFloat(nota.prova_professor) || 0,
            prova_final: parseFloat(nota.prova_final) || 0,
            ano_letivo: anoLetivo,
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

      loadNotasExistentes();
    } catch (error: any) {
      console.error('Erro ao salvar notas:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedAluno('');
    setSelectedDisciplina('');
    setNotas({
      1: { prova_professor: '', prova_final: '' },
      2: { prova_professor: '', prova_final: '' },
      3: { prova_professor: '', prova_final: '' }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Sistema de Notas por Trimestre</h3>
      </div>

      {/* Seleção de Aluno e Disciplina */}
      <Card>
        <CardHeader>
          <CardTitle>Selecionar Aluno e Disciplina</CardTitle>
        </CardHeader>
        <CardContent>
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
                      {aluno.nome} ({aluno.codigo})
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
                value={anoLetivo}
                onChange={(e) => setAnoLetivo(parseInt(e.target.value))}
                min="2020"
                max="2030"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Notas por Trimestre */}
      {selectedAluno && selectedDisciplina && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1º Trimestre */}
          <Card className="border-blue-500">
            <CardHeader className="bg-blue-50">
              <CardTitle className="flex items-center text-blue-700">
                🟦 1º Trimestre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="prova_professor_1">Prova do Professor 1</Label>
                <Input
                  id="prova_professor_1"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={notas[1].prova_professor}
                  onChange={(e) => handleNotaChange(1, 'prova_professor', e.target.value)}
                  placeholder="0.0 - 20.0"
                />
              </div>
              <div>
                <Label htmlFor="prova_final_1">Prova Final 1</Label>
                <Input
                  id="prova_final_1"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={notas[1].prova_final}
                  onChange={(e) => handleNotaChange(1, 'prova_final', e.target.value)}
                  placeholder="0.0 - 20.0"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2º Trimestre */}
          <Card className="border-green-500">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-700">
                🟩 2º Trimestre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="prova_professor_2">Prova do Professor 2</Label>
                <Input
                  id="prova_professor_2"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={notas[2].prova_professor}
                  onChange={(e) => handleNotaChange(2, 'prova_professor', e.target.value)}
                  placeholder="0.0 - 20.0"
                />
              </div>
              <div>
                <Label htmlFor="prova_final_2">Prova Final 2</Label>
                <Input
                  id="prova_final_2"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={notas[2].prova_final}
                  onChange={(e) => handleNotaChange(2, 'prova_final', e.target.value)}
                  placeholder="0.0 - 20.0"
                />
              </div>
            </CardContent>
          </Card>

          {/* 3º Trimestre */}
          <Card className="border-red-500">
            <CardHeader className="bg-red-50">
              <CardTitle className="flex items-center text-red-700">
                🟥 3º Trimestre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label htmlFor="prova_professor_3">Prova do Professor 3</Label>
                <Input
                  id="prova_professor_3"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={notas[3].prova_professor}
                  onChange={(e) => handleNotaChange(3, 'prova_professor', e.target.value)}
                  placeholder="0.0 - 20.0"
                />
              </div>
              <div>
                <Label htmlFor="prova_final_3">Prova Final 3</Label>
                <Input
                  id="prova_final_3"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={notas[3].prova_final}
                  onChange={(e) => handleNotaChange(3, 'prova_final', e.target.value)}
                  placeholder="0.0 - 20.0"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Botões de Ação */}
      {selectedAluno && selectedDisciplina && (
        <div className="flex space-x-4">
          <Button 
            onClick={handleSalvarNotas} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Salvando...' : 'Salvar Notas'}
          </Button>
          <Button variant="outline" onClick={resetForm}>
            Limpar Formulário
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotasTrimestre;
