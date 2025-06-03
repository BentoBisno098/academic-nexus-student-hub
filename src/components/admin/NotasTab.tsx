
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Nota {
  id: string;
  prova1: number;
  prova2: number;
  trabalho: number;
  media_final: number;
  trimestre: number;
  prova_professor: number;
  prova_final: number;
  ano_letivo: number;
  aluno_id: string;
  disciplina_id: string;
  aluno?: { nome: string; codigo: string };
  disciplina?: { nome: string; codigo: string };
}

interface Aluno {
  id: string;
  nome: string;
  codigo: string;
}

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
}

const NotasTab = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tipoNota, setTipoNota] = useState<'tradicional' | 'trimestral'>('tradicional');
  const [formData, setFormData] = useState({
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

      setNotas(transformedNotas);
      setAlunos(alunosData || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
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
        toast({ title: "Sucesso", description: "Nota atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('notas')
          .insert([notaData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Nota adicionada com sucesso!" });
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
      const { error } = await supabase
        .from('notas')
        .delete()
        .eq('id', id);

      if (error) throw error;
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

  const getStatusColor = (media: number) => {
    if (media >= 16) return 'bg-green-500';
    if (media >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTipoNotaBadge = (nota: Nota) => {
    const isTradicional = nota.prova1 !== null || nota.prova2 !== null || nota.trabalho !== null;
    return isTradicional ? (
      <Badge variant="outline" className="text-blue-600">Tradicional</Badge>
    ) : (
      <Badge variant="outline" className="text-purple-600">Trimestral</Badge>
    );
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

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Nota' : 'Nova Nota'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Aluno</Label>
                  <Select value={formData.aluno_id} onValueChange={(value) => setFormData({...formData, aluno_id: value})}>
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
                  <Select value={formData.disciplina_id} onValueChange={(value) => setFormData({...formData, disciplina_id: value})}>
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
                  <Label htmlFor="ano_letivo">Ano Letivo</Label>
                  <Input
                    id="ano_letivo"
                    type="number"
                    min="2020"
                    max="2030"
                    value={formData.ano_letivo}
                    onChange={(e) => setFormData({...formData, ano_letivo: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Tipo de Nota</Label>
                <Select value={tipoNota} onValueChange={(value: 'tradicional' | 'trimestral') => setTipoNota(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tradicional">Tradicional (P1, P2, Trabalho)</SelectItem>
                    <SelectItem value="trimestral">Trimestral (Professor, Final)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipoNota === 'tradicional' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prova1">Prova 1 (0-20)</Label>
                    <Input
                      id="prova1"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData.prova1}
                      onChange={(e) => setFormData({...formData, prova1: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prova2">Prova 2 (0-20)</Label>
                    <Input
                      id="prova2"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData.prova2}
                      onChange={(e) => setFormData({...formData, prova2: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="trabalho">Trabalho (0-20)</Label>
                    <Input
                      id="trabalho"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData.trabalho}
                      onChange={(e) => setFormData({...formData, trabalho: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Trimestre</Label>
                    <Select value={formData.trimestre} onValueChange={(value) => setFormData({...formData, trimestre: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o trimestre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1º Trimestre</SelectItem>
                        <SelectItem value="2">2º Trimestre</SelectItem>
                        <SelectItem value="3">3º Trimestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="prova_professor">Prova Professor (0-20)</Label>
                    <Input
                      id="prova_professor"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData.prova_professor}
                      onChange={(e) => setFormData({...formData, prova_professor: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="prova_final">Prova Final (0-20)</Label>
                    <Input
                      id="prova_final"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={formData.prova_final}
                      onChange={(e) => setFormData({...formData, prova_final: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button type="submit" disabled={isLoading}>
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Notas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Notas ({notas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Aluno</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Detalhes</TableHead>
                <TableHead>Média Final</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notas.map((nota) => {
                const isTradicional = nota.prova1 !== null || nota.prova2 !== null || nota.trabalho !== null;
                return (
                  <TableRow key={nota.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{nota.aluno?.nome}</p>
                        <p className="text-sm text-gray-500">{nota.aluno?.codigo}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{nota.disciplina?.nome}</p>
                        <p className="text-sm text-gray-500">{nota.disciplina?.codigo}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTipoNotaBadge(nota)}</TableCell>
                    <TableCell>{nota.ano_letivo || '-'}</TableCell>
                    <TableCell>
                      {isTradicional ? (
                        <div className="text-sm">
                          <p>P1: {nota.prova1 || '-'}</p>
                          <p>P2: {nota.prova2 || '-'}</p>
                          <p>Trab: {nota.trabalho || '-'}</p>
                        </div>
                      ) : (
                        <div className="text-sm">
                          <p>Trim: {nota.trimestre}º</p>
                          <p>Prof: {nota.prova_professor || '-'}</p>
                          <p>Final: {nota.prova_final || '-'}</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(nota.media_final || 0)} text-white`}>
                        {nota.media_final?.toFixed(1) || '-'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(nota)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(nota.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {notas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma nota encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotasTab;
