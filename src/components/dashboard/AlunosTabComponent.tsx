
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Aluno {
  id: string;
  nome: string;
  codigo: string;
  senha: string;
  curso: string;
  turma: string;
  idade: number;
}

const AlunosTabComponent = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [filteredAlunos, setFilteredAlunos] = useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    senha: '',
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
  }, [alunos, searchTerm]);

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
      senha: aluno.senha || '',
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
    setFormData({ nome: '', codigo: '', senha: '', curso: '', turma: '', idade: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h3>
          <p className="text-gray-600 mt-1">Adicionar, editar e remover alunos do sistema</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Aluno
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou código..."
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
  );
};

export default AlunosTabComponent;
