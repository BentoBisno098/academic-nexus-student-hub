
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

interface Horario {
  id: string;
  disciplina_id: string;
  turma: string;
  dia: string;
  inicio: string;
  fim: string;
  disciplina_nome?: string;
}

interface Disciplina {
  id: string;
  nome: string;
}

const HorariosTab = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [filteredHorarios, setFilteredHorarios] = useState<Horario[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterTurma, setFilterTurma] = useState('');
  const [formData, setFormData] = useState({
    disciplina_id: '',
    turma: '',
    dia: '',
    inicio: '',
    fim: ''
  });
  const { toast } = useToast();

  const diasSemana = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterHorarios();
  }, [horarios, filterTurma]);

  const loadData = async () => {
    try {
      const [horariosResponse, disciplinasResponse] = await Promise.all([
        supabase.from('horarios').select('*'),
        supabase.from('disciplinas').select('id, nome').order('nome')
      ]);

      if (horariosResponse.error) throw horariosResponse.error;
      if (disciplinasResponse.error) throw disciplinasResponse.error;

      setDisciplinas(disciplinasResponse.data || []);

      // Enriquecer horários com nomes das disciplinas
      const horariosEnriquecidos = (horariosResponse.data || []).map(horario => ({
        ...horario,
        disciplina_nome: disciplinasResponse.data?.find(d => d.id === horario.disciplina_id)?.nome || 'Desconhecida'
      }));

      setHorarios(horariosEnriquecidos);
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

  const filterHorarios = () => {
    let filtered = horarios;

    if (filterTurma) {
      filtered = filtered.filter(horario => horario.turma === filterTurma);
    }

    setFilteredHorarios(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from('horarios')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('horarios')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário adicionado com sucesso!" });
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

  const handleEdit = (horario: Horario) => {
    setFormData({
      disciplina_id: horario.disciplina_id,
      turma: horario.turma || '',
      dia: horario.dia || '',
      inicio: horario.inicio || '',
      fim: horario.fim || ''
    });
    setEditingId(horario.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) return;

    try {
      const { error } = await supabase
        .from('horarios')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Sucesso", description: "Horário excluído com sucesso!" });
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
    setFormData({ disciplina_id: '', turma: '', dia: '', inicio: '', fim: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const turmas = [...new Set(horarios.map(h => h.turma))].filter(Boolean);

  if (isLoading) {
    return <div className="text-center py-4">Carregando horários...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Horários</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Horário
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="turma-filter">Filtrar por Turma</Label>
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
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFilterTurma('')}
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
            <CardTitle>{editingId ? 'Editar Horário' : 'Novo Horário'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Label htmlFor="turma">Turma</Label>
                <Input
                  id="turma"
                  value={formData.turma}
                  onChange={(e) => setFormData({...formData, turma: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dia">Dia da Semana</Label>
                <select
                  id="dia"
                  value={formData.dia}
                  onChange={(e) => setFormData({...formData, dia: e.target.value})}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  required
                >
                  <option value="">Selecione o dia</option>
                  {diasSemana.map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="inicio">Horário de Início</Label>
                <Input
                  id="inicio"
                  type="time"
                  value={formData.inicio}
                  onChange={(e) => setFormData({...formData, inicio: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fim">Horário de Fim</Label>
                <Input
                  id="fim"
                  type="time"
                  value={formData.fim}
                  onChange={(e) => setFormData({...formData, fim: e.target.value})}
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

      {/* Lista de Horários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Horários ({filteredHorarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Dia</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Fim</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHorarios.map((horario) => (
                <TableRow key={horario.id}>
                  <TableCell className="font-medium">{horario.disciplina_nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{horario.turma}</Badge>
                  </TableCell>
                  <TableCell>{horario.dia}</TableCell>
                  <TableCell>{horario.inicio}</TableCell>
                  <TableCell>{horario.fim}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(horario)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(horario.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredHorarios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhum horário encontrado
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HorariosTab;
