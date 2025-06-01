
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

interface Horario {
  id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplina_id: string;
  disciplinas?: { nome: string; codigo: string };
}

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
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
    dia: '',
    inicio: '',
    fim: '',
    turma: '',
    disciplina_id: ''
  });
  const { toast } = useToast();

  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterHorarios();
  }, [horarios, filterTurma]);

  const loadData = async () => {
    try {
      // Carregar horários com joins usando a relação correta
      const { data: horariosData, error: horariosError } = await supabase
        .from('horarios')
        .select(`
          *,
          disciplinas!horarios_disciplina_id_fkey(nome, codigo)
        `)
        .order('dia')
        .order('inicio');

      if (horariosError) throw horariosError;

      // Carregar disciplinas
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('id, nome, codigo')
        .order('nome');

      if (disciplinasError) throw disciplinasError;

      setHorarios(horariosData || []);
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

  const filterHorarios = () => {
    let filtered = horarios;

    if (filterTurma) {
      filtered = filtered.filter(horario => horario.turma === filterTurma);
    }

    // Ordenar por dia da semana e hora
    filtered.sort((a, b) => {
      const diaA = diasSemana.indexOf(a.dia);
      const diaB = diasSemana.indexOf(b.dia);
      if (diaA !== diaB) return diaA - diaB;
      return a.inicio.localeCompare(b.inicio);
    });

    setFilteredHorarios(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const horarioData = {
        dia: formData.dia,
        inicio: formData.inicio,
        fim: formData.fim,
        turma: formData.turma,
        disciplina_id: formData.disciplina_id
      };

      if (editingId) {
        const { error } = await supabase
          .from('horarios')
          .update(horarioData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('horarios')
          .insert([horarioData]);
        
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
      dia: horario.dia,
      inicio: horario.inicio,
      fim: horario.fim,
      turma: horario.turma,
      disciplina_id: horario.disciplina_id
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
    setFormData({
      dia: '',
      inicio: '',
      fim: '',
      turma: '',
      disciplina_id: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const uniqueTurmas = [...new Set(horarios.map(h => h.turma).filter(Boolean))];

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

      {/* Formulário */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Horário' : 'Novo Horário'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Dia da Semana</Label>
                <Select value={formData.dia} onValueChange={(value) => setFormData({...formData, dia: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {diasSemana.map(dia => (
                      <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="inicio">Hora de Início</Label>
                <Input
                  id="inicio"
                  type="time"
                  value={formData.inicio}
                  onChange={(e) => setFormData({...formData, inicio: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fim">Hora de Fim</Label>
                <Input
                  id="fim"
                  type="time"
                  value={formData.fim}
                  onChange={(e) => setFormData({...formData, fim: e.target.value})}
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

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </CardContent>
      </Card>

      {/* Lista de Horários */}
      <Card>
        <CardHeader>
          <CardTitle>
            Lista de Horários ({filteredHorarios.length})
            {filterTurma && ` - Turma: ${filterTurma}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHorarios.map((horario) => (
                <TableRow key={horario.id}>
                  <TableCell>
                    <Badge variant="outline">{horario.dia}</Badge>
                  </TableCell>
                  <TableCell>
                    {horario.inicio} - {horario.fim}
                  </TableCell>
                  <TableCell>
                    <Badge>{horario.turma}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{horario.disciplinas?.nome || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{horario.disciplinas?.codigo || 'N/A'}</p>
                    </div>
                  </TableCell>
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
