import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import AdminNavigation from '@/components/AdminNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface Aluno {
  id: string;
  nome: string;
  codigo: string;
  curso: string;
  turma: string;
  idade: number;
  periodo: string;
}

const AdminAlunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCurso, setFilterCurso] = useState('');
  const [filterTurma, setFilterTurma] = useState('');
  const [filterPeriodo, setFilterPeriodo] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    curso: '',
    turma: '',
    idade: '',
    periodo: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin-login');
        return;
      }
      loadAlunos();
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    filterAlunos();
  }, [alunos, searchTerm, filterCurso, filterTurma, filterPeriodo]);

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

    if (filterCurso) {
      filtered = filtered.filter(aluno => aluno.curso === filterCurso);
    }

    if (filterTurma) {
      filtered = filtered.filter(aluno => aluno.turma === filterTurma);
    }

    if (filterPeriodo) {
      filtered = filtered.filter(aluno => aluno.periodo === filterPeriodo);
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
        idade: parseInt(formData.idade),
        periodo: formData.periodo
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
      idade: aluno.idade.toString(),
      periodo: aluno.periodo || ''
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
    setFormData({ nome: '', codigo: '', curso: '', turma: '', idade: '', periodo: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const cursos = [...new Set(alunos.map(a => a.curso))].filter(Boolean);
  const turmas = [...new Set(alunos.map(a => a.turma))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gerenciar Alunos</h1>
            <p className="text-gray-600 mt-2">Adicionar, editar e remover alunos do sistema</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Aluno
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <Label htmlFor="periodo-filter">Período</Label>
                <select
                  id="periodo-filter"
                  value={filterPeriodo}
                  onChange={(e) => setFilterPeriodo(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="">Todos os períodos</option>
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCurso('');
                    setFilterTurma('');
                    setFilterPeriodo('');
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
          <Card className="mb-6">
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
                <div>
                  <Label htmlFor="periodo">Período</Label>
                  <Select 
                    value={formData.periodo} 
                    onValueChange={(value) => setFormData({...formData, periodo: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manhã">Manhã</SelectItem>
                      <SelectItem value="Tarde">Tarde</SelectItem>
                    </SelectContent>
                  </Select>
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
            {isLoading ? (
              <div className="text-center py-4">Carregando...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Nome</th>
                      <th className="text-left p-2">Código</th>
                      <th className="text-left p-2">Curso</th>
                      <th className="text-left p-2">Turma</th>
                      <th className="text-left p-2">Período</th>
                      <th className="text-left p-2">Idade</th>
                      <th className="text-left p-2">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlunos.map((aluno) => (
                      <tr key={aluno.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{aluno.nome}</td>
                        <td className="p-2">
                          <Badge variant="outline">{aluno.codigo}</Badge>
                        </td>
                        <td className="p-2">{aluno.curso}</td>
                        <td className="p-2">{aluno.turma}</td>
                        <td className="p-2">
                          {aluno.periodo && (
                            <Badge variant="secondary">{aluno.periodo}</Badge>
                          )}
                        </td>
                        <td className="p-2">{aluno.idade}</td>
                        <td className="p-2">
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
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredAlunos.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum aluno encontrado
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAlunos;
