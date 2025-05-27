
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Nota {
  id: string;
  aluno_id: string;
  disciplina_id: string;
  prova1: number;
  prova2: number;
  trabalho: number;
  media_final: number;
  aluno_nome?: string;
  disciplina_nome?: string;
}

interface Aluno {
  id: string;
  nome: string;
}

interface Disciplina {
  id: string;
  nome: string;
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
      const [notasResponse, alunosResponse, disciplinasResponse] = await Promise.all([
        supabase.from('notas').select('*'),
        supabase.from('alunos').select('id, nome').order('nome'),
        supabase.from('disciplinas').select('id, nome').order('nome')
      ]);

      if (notasResponse.error) throw notasResponse.error;
      if (alunosResponse.error) throw alunosResponse.error;
      if (disciplinasResponse.error) throw disciplinasResponse.error;

      setAlunos(alunosResponse.data || []);
      setDisciplinas(disciplinasResponse.data || []);

      // Enriquecer notas com nomes de alunos e disciplinas
      const notasEnriquecidas = (notasResponse.data || []).map(nota => ({
        ...nota,
        aluno_nome: alunosResponse.data?.find(a => a.id === nota.aluno_id)?.nome || 'Desconhecido',
        disciplina_nome: disciplinasResponse.data?.find(d => d.id === nota.disciplina_id)?.nome || 'Desconhecida'
      }));

      setNotas(notasEnriquecidas);
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
        prova1: parseFloat(formData.prova1) || 0,
        prova2: parseFloat(formData.prova2) || 0,
        trabalho: parseFloat(formData.trabalho) || 0
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
    setFormData({ aluno_id: '', disciplina_id: '', prova1: '', prova2: '', trabalho: '' });
    setEditingId(null);
    setShowForm(false);
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
                <Label htmlFor="aluno">Aluno</Label>
                <select
                  id="aluno"
                  value={formData.aluno_id}
                  onChange={(e) => setFormData({...formData, aluno_id: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="disciplina">Disciplina</Label>
                <select
                  id="disciplina"
                  value={formData.disciplina_id}
                  onChange={(e) => setFormData({...formData, disciplina_id: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Selecione uma disciplina</option>
                  {disciplinas.map(disciplina => (
                    <option key={disciplina.id} value={disciplina.id}>{disciplina.nome}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="prova1">Prova 1</Label>
                <Input
                  id="prova1"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.prova1}
                  onChange={(e) => setFormData({...formData, prova1: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="prova2">Prova 2</Label>
                <Input
                  id="prova2"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.prova2}
                  onChange={(e) => setFormData({...formData, prova2: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="trabalho">Trabalho</Label>
                <Input
                  id="trabalho"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.trabalho}
                  onChange={(e) => setFormData({...formData, trabalho: e.target.value})}
                />
              </div>
              <div className="flex items-end space-x-2">
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
                  <TableCell className="font-medium">{nota.aluno_nome}</TableCell>
                  <TableCell>{nota.disciplina_nome}</TableCell>
                  <TableCell>{nota.prova1?.toFixed(1) || '0.0'}</TableCell>
                  <TableCell>{nota.prova2?.toFixed(1) || '0.0'}</TableCell>
                  <TableCell>{nota.trabalho?.toFixed(1) || '0.0'}</TableCell>
                  <TableCell>
                    <Badge variant={nota.media_final >= 7 ? "default" : "destructive"}>
                      {nota.media_final?.toFixed(1) || '0.0'}
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
