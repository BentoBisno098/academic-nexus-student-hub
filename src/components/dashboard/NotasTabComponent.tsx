
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Nota {
  id: string;
  prova1: number;
  prova2: number;
  trabalho: number;
  media_final: number;
  aluno_id: string;
  disciplina_id: string;
  alunos?: { nome: string; codigo: string };
  disciplinas?: { nome: string; codigo: string };
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

const NotasTabComponent = () => {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [filteredNotas, setFilteredNotas] = useState<Nota[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    filterNotas();
  }, [notas, searchTerm]);

  const loadData = async () => {
    try {
      const [notasResponse, alunosResponse, disciplinasResponse] = await Promise.all([
        supabase
          .from('notas')
          .select(`
            *,
            alunos!notas_aluno_id_fkey (nome, codigo),
            disciplinas!notas_disciplina_id_fkey (nome, codigo)
          `),
        supabase
          .from('alunos')
          .select('id, nome, codigo')
          .order('nome'),
        supabase
          .from('disciplinas')
          .select('id, nome, codigo')
          .order('nome')
      ]);

      if (notasResponse.error) throw notasResponse.error;
      if (alunosResponse.error) throw alunosResponse.error;
      if (disciplinasResponse.error) throw disciplinasResponse.error;

      setNotas(notasResponse.data || []);
      setAlunos(alunosResponse.data || []);
      setDisciplinas(disciplinasResponse.data || []);
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

  const filterNotas = () => {
    let filtered = notas;

    if (searchTerm) {
      filtered = filtered.filter(nota => 
        nota.alunos?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.alunos?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nota.disciplinas?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNotas(filtered);
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
        toast({ title: "Sucesso", description: "Nota lançada com sucesso!" });
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
      prova1: nota.prova1.toString(),
      prova2: nota.prova2.toString(),
      trabalho: nota.trabalho.toString()
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Gerenciar Notas</h3>
          <p className="text-gray-600 mt-1">Lançar e editar notas dos alunos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Nota
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Notas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por aluno ou disciplina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Nota' : 'Nova Nota'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="aluno_id">Aluno</Label>
                <select
                  id="aluno_id"
                  value={formData.aluno_id}
                  onChange={(e) => setFormData({...formData, aluno_id: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Selecione um aluno</option>
                  {alunos.map(aluno => (
                    <option key={aluno.id} value={aluno.id}>
                      {aluno.nome} ({aluno.codigo})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="disciplina_id">Disciplina</Label>
                <select
                  id="disciplina_id"
                  value={formData.disciplina_id}
                  onChange={(e) => setFormData({...formData, disciplina_id: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Selecione uma disciplina</option>
                  {disciplinas.map(disciplina => (
                    <option key={disciplina.id} value={disciplina.id}>
                      {disciplina.nome} ({disciplina.codigo})
                    </option>
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
                  required
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
                  required
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
                  required
                />
              </div>
              <div className="flex items-end space-x-2 md:col-span-2 lg:col-span-5">
                <Button type="submit" disabled={isLoading}>
                  {editingId ? 'Atualizar' : 'Lançar Nota'}
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
          <CardTitle>Lista de Notas ({filteredNotas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Carregando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Aluno</th>
                    <th className="text-left p-2">Disciplina</th>
                    <th className="text-left p-2">Prova 1</th>
                    <th className="text-left p-2">Prova 2</th>
                    <th className="text-left p-2">Trabalho</th>
                    <th className="text-left p-2">Média Final</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotas.map((nota) => (
                    <tr key={nota.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{nota.alunos?.nome || 'N/A'}</div>
                          <Badge variant="outline" className="text-xs">{nota.alunos?.codigo || 'N/A'}</Badge>
                        </div>
                      </td>
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{nota.disciplinas?.nome || 'N/A'}</div>
                          <Badge variant="outline" className="text-xs">{nota.disciplinas?.codigo || 'N/A'}</Badge>
                        </div>
                      </td>
                      <td className="p-2">{nota.prova1?.toFixed(1) || '0.0'}</td>
                      <td className="p-2">{nota.prova2?.toFixed(1) || '0.0'}</td>
                      <td className="p-2">{nota.trabalho?.toFixed(1) || '0.0'}</td>
                      <td className="p-2">
                        <Badge variant={nota.media_final >= 7 ? "default" : "destructive"}>
                          {nota.media_final?.toFixed(1) || '0.0'}
                        </Badge>
                      </td>
                      <td className="p-2">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredNotas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma nota encontrada
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotasTabComponent;
