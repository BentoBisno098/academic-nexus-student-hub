import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Nota {
  id: string;
  trimestre: number;
  prova_professor: number;
  prova_final: number;
  media_final: number;
  ano_letivo: number;
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
    trimestre: '',
    prova_professor: '',
    prova_final: '',
    ano_letivo: new Date().getFullYear().toString()
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
          `)
          .not('trimestre', 'is', null),
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
    
    const provaProf = parseFloat(formData.prova_professor);
    const provaFinal = parseFloat(formData.prova_final);
    
    // Validar se as notas estão entre 1 e 20
    if (provaProf < 1 || provaProf > 20 || provaFinal < 1 || provaFinal > 20) {
      toast({
        title: "Valor inválido",
        description: "As notas devem estar entre 1 e 20",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const notaData = {
        aluno_id: formData.aluno_id,
        disciplina_id: formData.disciplina_id,
        ano_letivo: parseInt(formData.ano_letivo) || new Date().getFullYear(),
        trimestre: parseInt(formData.trimestre) || 1,
        prova_professor: provaProf || 0,
        prova_final: provaFinal || 0,
        prova1: null,
        prova2: null,
        trabalho: null
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
      trimestre: '',
      prova_professor: '',
      prova_final: '',
      ano_letivo: new Date().getFullYear().toString()
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Gerenciar Notas Trimestrais</h3>
          <p className="text-gray-600 mt-1">Lançar e editar notas por trimestre</p>
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
            <CardTitle>{editingId ? 'Editar Nota' : 'Nova Nota Trimestral'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="aluno_id">Aluno</Label>
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
                  <Label htmlFor="disciplina_id">Disciplina</Label>
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
                  <Label htmlFor="prova_professor">Prova Professor (1-20)</Label>
                  <Input
                    id="prova_professor"
                    type="number"
                    step="0.1"
                    min="1"
                    max="20"
                    value={formData.prova_professor}
                    onChange={(e) => setFormData({...formData, prova_professor: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prova_final">Prova Final (1-20)</Label>
                  <Input
                    id="prova_final"
                    type="number"
                    step="0.1"
                    min="1"
                    max="20"
                    value={formData.prova_final}
                    onChange={(e) => setFormData({...formData, prova_final: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
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
          <CardTitle>Lista de Notas Trimestrais ({filteredNotas.length})</CardTitle>
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
                    <th className="text-left p-2">Trimestre</th>
                    <th className="text-left p-2">Ano</th>
                    <th className="text-left p-2">Prova Professor</th>
                    <th className="text-left p-2">Prova Final</th>
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
                      <td className="p-2">
                        <Badge variant="outline" className="text-purple-600">
                          {nota.trimestre}º Trim
                        </Badge>
                      </td>
                      <td className="p-2">{nota.ano_letivo || '-'}</td>
                      <td className="p-2">{nota.prova_professor?.toFixed(1) || '0.0'}</td>
                      <td className="p-2">{nota.prova_final?.toFixed(1) || '0.0'}</td>
                      <td className="p-2">
                        <Badge variant={nota.media_final >= 10 ? "default" : "destructive"}>
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
