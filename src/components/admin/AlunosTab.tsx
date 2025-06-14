
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Aluno {
  id: string;
  nome: string;
  codigo: string;
  senha: string;
  idade: number;
  curso: string;
  turma: string;
  periodo: string;
  periodo_id: string;
  sala: string;
}

interface Periodo {
  id: string;
  nome: string;
  ativo: boolean;
}

const AlunosTab = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTurma, setFilterTurma] = useState('');
  const [filterCurso, setFilterCurso] = useState('');
  const [filterPeriodo, setFilterPeriodo] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    senha: '',
    idade: '',
    curso: '',
    turma: '',
    periodo_id: '',
    sala: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAlunos();
  }, [alunos, searchTerm, filterTurma, filterCurso, filterPeriodo]);

  const loadData = async () => {
    try {
      // Carregar alunos com período
      const { data: alunosData, error: alunosError } = await supabase
        .from('alunos')
        .select(`
          *,
          periodos!alunos_periodo_id_fkey (id, nome)
        `)
        .order('nome');

      if (alunosError) throw alunosError;
      
      // Transformar dados dos alunos
      const alunosFormatted = alunosData?.map(aluno => ({
        ...aluno,
        periodo: aluno.periodos?.nome || aluno.periodo || 'N/A'
      })) || [];

      setAlunos(alunosFormatted);

      // Carregar períodos ativos
      const { data: periodosData, error: periodosError } = await supabase
        .from('periodos')
        .select('id, nome, ativo')
        .eq('ativo', true)
        .order('nome');

      if (periodosError) throw periodosError;
      setPeriodos(periodosData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de dados",
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
        aluno.codigo.includes(searchTerm)
      );
    }

    if (filterTurma) {
      filtered = filtered.filter(aluno => aluno.turma === filterTurma);
    }

    if (filterCurso) {
      filtered = filtered.filter(aluno => aluno.curso === filterCurso);
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
        senha: formData.senha,
        idade: parseInt(formData.idade),
        curso: formData.curso,
        turma: formData.turma,
        periodo_id: formData.periodo_id,
        sala: formData.sala
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

  const handleEdit = (aluno: Aluno) => {
    setFormData({
      nome: aluno.nome,
      codigo: aluno.codigo,
      senha: aluno.senha || '',
      idade: aluno.idade?.toString() || '',
      curso: aluno.curso || '',
      turma: aluno.turma || '',
      periodo_id: aluno.periodo_id || '',
      sala: aluno.sala || ''
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
      nome: '',
      codigo: '',
      senha: '',
      idade: '',
      curso: '',
      turma: '',
      periodo_id: '',
      sala: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const uniqueTurmas = [...new Set(alunos.map(a => a.turma).filter(Boolean))];
  const uniqueCursos = [...new Set(alunos.map(a => a.curso).filter(Boolean))];
  const uniquePeriodos = [...new Set(alunos.map(a => a.periodo).filter(Boolean))];

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

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Aluno' : 'Novo Aluno'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={formData.senha}
                  onChange={(e) => setFormData({...formData, senha: e.target.value})}
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
                />
              </div>
              <div>
                <Label htmlFor="curso">Curso</Label>
                <Input
                  id="curso"
                  value={formData.curso}
                  onChange={(e) => setFormData({...formData, curso: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="turma">Turma</Label>
                <Input
                  id="turma"
                  value={formData.turma}
                  onChange={(e) => setFormData({...formData, turma: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="sala">Sala</Label>
                <Input
                  id="sala"
                  value={formData.sala}
                  onChange={(e) => setFormData({...formData, sala: e.target.value})}
                  placeholder="Ex: Sala 101"
                />
              </div>
              <div>
                <Label htmlFor="periodo">Período</Label>
                <Select 
                  value={formData.periodo_id} 
                  onValueChange={(value) => setFormData({...formData, periodo_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodos.map(periodo => (
                      <SelectItem key={periodo.id} value={periodo.id}>
                        {periodo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end space-x-2 md:col-span-2 lg:col-span-4">
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

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTurma} onValueChange={setFilterTurma}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por turma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas as turmas</SelectItem>
                {uniqueTurmas.map(turma => (
                  <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCurso} onValueChange={setFilterCurso}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os cursos</SelectItem>
                {uniqueCursos.map(curso => (
                  <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPeriodo} onValueChange={setFilterPeriodo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os períodos</SelectItem>
                {uniquePeriodos.map(periodo => (
                  <SelectItem key={periodo} value={periodo}>{periodo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

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
                <TableHead>Idade</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Período</TableHead>
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
                  <TableCell>{aluno.idade || 'N/A'}</TableCell>
                  <TableCell>{aluno.curso || 'N/A'}</TableCell>
                  <TableCell>
                    {aluno.turma && <Badge>{aluno.turma}</Badge>}
                  </TableCell>
                  <TableCell>
                    {aluno.sala && <Badge variant="secondary">{aluno.sala}</Badge>}
                  </TableCell>
                  <TableCell>
                    {aluno.periodo && (
                      <Badge variant="secondary">{aluno.periodo}</Badge>
                    )}
                  </TableCell>
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
