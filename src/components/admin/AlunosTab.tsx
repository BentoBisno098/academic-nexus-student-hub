
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Aluno {
  id: string;
  nome: string;
  codigo: string;
  curso: string;
  turma: string;
  idade: number;
}

const AlunosTab = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurma, setFilterTurma] = useState('');
  const [filterCurso, setFilterCurso] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    curso: '',
    turma: '',
    idade: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAlunos();
  }, []);

  useEffect(() => {
    filterAlunos();
  }, [alunos, searchTerm, filterTurma, filterCurso]);

  const loadAlunos = async () => {
    try {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setAlunos(data || []);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de alunos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAlunos = () => {
    let filtered = alunos;

    if (searchTerm) {
      filtered = filtered.filter(aluno => 
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.codigo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterTurma) {
      filtered = filtered.filter(aluno => aluno.turma === filterTurma);
    }

    if (filterCurso) {
      filtered = filtered.filter(aluno => aluno.curso === filterCurso);
    }

    setFilteredAlunos(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const alunoData = {
        nome: formData.nome,
        codigo: formData.codigo,
        curso: formData.curso,
        turma: formData.turma,
        idade: parseInt(formData.idade)
      };

      if (editingId) {
        const { error } = await supabase
          .from('alunos')
          .update(alunoData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Aluno atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('alunos')
          .insert([alunoData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Aluno adicionado com sucesso!" });
      }

      resetForm();
      loadAlunos();
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

  const handleEdit = (aluno: Aluno) => {
    setFormData({
      nome: aluno.nome,
      codigo: aluno.codigo,
      curso: aluno.curso,
      turma: aluno.turma,
      idade: aluno.idade.toString()
    });
    setEditingId(aluno.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este aluno?')) return;

    try {
      const { error } = await supabase
        .from('alunos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Aluno excluído com sucesso!" });
      loadAlunos();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', codigo: '', curso: '', turma: '', idade: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const turmas = [...new Set(alunos.map(a => a.turma))].filter(Boolean);
  const cursos = [...new Set(alunos.map(a => a.curso))].filter(Boolean);

  if (isLoading) {
    return <div className="text-center py-4">Carregando alunos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Alunos</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="turma-filter">Turma</Label>
              <select
                id="turma-filter"
                value={filterTurma}
                onChange={(e) => setFilterTurma(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Todas as turmas</option>
                {turmas.map(turma => (
                  <option key={turma} value={turma}>{turma}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="curso-filter">Curso</Label>
              <select
                id="curso-filter"
                value={filterCurso}
                onChange={(e) => setFilterCurso(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">Todos os cursos</option>
                {cursos.map(curso => (
                  <option key={curso} value={curso}>{curso}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterTurma('');
                  setFilterCurso('');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Aluno' : 'Novo Aluno'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="curso">Curso</Label>
                <Input
                  id="curso"
                  value={formData.curso}
                  onChange={(e) => setFormData({...formData, curso: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="turma">Turma</Label>
                <Input
                  id="turma"
                  value={formData.turma}
                  onChange={(e) => setFormData({...formData, turma: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  value={formData.idade}
                  onChange={(e) => setFormData({...formData, idade: e.target.value})}
                  required
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

      {/* Lista de Alunos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alunos ({filteredAlunos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell className="font-medium">{aluno.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{aluno.codigo}</Badge>
                  </TableCell>
                  <TableCell>{aluno.curso}</TableCell>
                  <TableCell>{aluno.turma}</TableCell>
                  <TableCell>{aluno.idade}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(aluno)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(aluno.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredAlunos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum aluno encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlunosTab;
