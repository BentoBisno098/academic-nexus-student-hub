
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  professor: string;
}

const DisciplinasTabComponent = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [filteredDisciplinas, setFilteredDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    professor: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDisciplinas();
  }, []);

  useEffect(() => {
    filterDisciplinas();
  }, [disciplinas, searchTerm]);

  const loadDisciplinas = async () => {
    try {
      const { data, error } = await supabase
        .from('disciplinas')
        .select('*')
        .order('nome');

      if (error) throw error;
      setDisciplinas(data || []);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar lista de disciplinas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterDisciplinas = () => {
    let filtered = disciplinas;

    if (searchTerm) {
      filtered = filtered.filter(disciplina => 
        disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disciplina.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disciplina.professor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDisciplinas(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const disciplinaData = {
        nome: formData.nome,
        codigo: formData.codigo,
        professor: formData.professor
      };

      if (editingId) {
        const { error } = await supabase
          .from('disciplinas')
          .update(disciplinaData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Disciplina atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('disciplinas')
          .insert([disciplinaData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Disciplina adicionada com sucesso!" });
      }

      resetForm();
      loadDisciplinas();
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

  const handleEdit = (disciplina: Disciplina) => {
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      professor: disciplina.professor
    });
    setEditingId(disciplina.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta disciplina?')) return;

    try {
      const { error } = await supabase
        .from('disciplinas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Disciplina excluída com sucesso!" });
      loadDisciplinas();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({ nome: '', codigo: '', professor: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Gerenciar Disciplinas</h3>
          <p className="text-gray-600 mt-1">Adicionar, editar e remover disciplinas do sistema</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Disciplina
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Disciplinas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, código ou professor..."
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
            <CardTitle>{editingId ? 'Editar Disciplina' : 'Nova Disciplina'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="professor">Professor</Label>
                <Input
                  id="professor"
                  value={formData.professor}
                  onChange={(e) => setFormData({...formData, professor: e.target.value})}
                  required
                />
              </div>
              <div className="flex items-end space-x-2 md:col-span-3">
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

      {/* Lista de Disciplinas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Disciplinas ({filteredDisciplinas.length})</CardTitle>
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
                    <th className="text-left p-2">Professor</th>
                    <th className="text-left p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisciplinas.map((disciplina) => (
                    <tr key={disciplina.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{disciplina.nome}</td>
                      <td className="p-2">
                        <Badge variant="outline">{disciplina.codigo}</Badge>
                      </td>
                      <td className="p-2">{disciplina.professor}</td>
                      <td className="p-2">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(disciplina)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(disciplina.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredDisciplinas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma disciplina encontrada
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DisciplinasTabComponent;
