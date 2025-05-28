
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
  const [formData, setFormData] = useState({
    aluno_id: '',
    disciplina_id: '',
    prova1: '',
    prova2: '',
    trabalho: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Carregar notas com joins
      const { data: notasData, error: notasError } = await supabase
        .from('notas')
        .select(`
          *,
          aluno:alunos(nome, codigo),
          disciplina:disciplinas(nome, codigo)
        `)
        .order('created_at', { ascending: false });

      if (notasError) throw notasError;

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

      setNotas(notasData || []);
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

  const calculateMedia = (prova1: number, prova2: number, trabalho: number) => {
    const total = (prova1 || 0) + (prova2 || 0) + (trabalho || 0);
    return total / 3;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const prova1 = parseFloat(formData.prova1) || 0;
      const prova2 = parseFloat(formData.prova2) || 0;
      const trabalho = parseFloat(formData.trabalho) || 0;
      const media_final = calculateMedia(prova1, prova2, trabalho);

      const notaData = {
        aluno_id: formData.aluno_id,
        disciplina_id: formData.disciplina_id,
        prova1,
        prova2,
        trabalho,
        media_final
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
    setFormData({
      aluno_id: nota.aluno_id,
      disciplina_id: nota.disciplina_id,
      prova1: nota.prova1?.toString() || '',
      prova2: nota.prova2?.toString() || '',
      trabalho: nota.trabalho?.toString() || ''
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
      trabalho: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const getStatusColor = (media: number) => {
    if (media >= 16) return 'bg-green-500';
    if (media >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div>
                <Label>Média Final (calculada automaticamente)</Label>
                <Input
                  value={calculateMedia(
                    parseFloat(formData.prova1) || 0,
                    parseFloat(formData.prova2) || 0,
                    parseFloat(formData.trabalho) || 0
                  ).toFixed(1)}
                  disabled
                />
              </div>
              <div className="flex items-end space-x-2 md:col-span-2 lg:col-span-3">
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
                <TableHead>Prova 1</TableHead>
                <TableHead>Prova 2</TableHead>
                <TableHead>Trabalho</TableHead>
                <TableHead>Média Final</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notas.map((nota) => (
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
                  <TableCell>{nota.prova1 || '-'}</TableCell>
                  <TableCell>{nota.prova2 || '-'}</TableCell>
                  <TableCell>{nota.trabalho || '-'}</TableCell>
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
              ))}
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
