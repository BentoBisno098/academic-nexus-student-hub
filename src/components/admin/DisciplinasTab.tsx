
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  professor: string;
}

interface Horario {
  id: string;
  disciplina_id: string;
  dia: string;
  inicio: string;
  fim: string;
  sala?: string;
}

const DisciplinasTab = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showHorarioForm, setShowHorarioForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingHorarioId, setEditingHorarioId] = useState<string | null>(null);
  const [selectedDisciplinaId, setSelectedDisciplinaId] = useState<string>('');
  const [expandedDisciplina, setExpandedDisciplina] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    professor: ''
  });
  const [horarioFormData, setHorarioFormData] = useState({
    disciplina_id: '',
    dia: '',
    inicio: '',
    fim: '',
    sala: ''
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

  const loadData = async () => {
    try {
      // Carregar disciplinas
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('*')
        .order('nome');

      if (disciplinasError) throw disciplinasError;

      // Carregar horários
      const { data: horariosData, error: horariosError } = await supabase
        .from('horarios')
        .select('*')
        .order('dia', { ascending: true });

      if (horariosError) throw horariosError;

      setDisciplinas(disciplinasData || []);
      setHorarios(horariosData || []);
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
      if (editingId) {
        const { error } = await supabase
          .from('disciplinas')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Disciplina atualizada com sucesso!" });
      } else {
        const { error } = await supabase
          .from('disciplinas')
          .insert([formData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Disciplina adicionada com sucesso!" });
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

  const handleHorarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar horários duplicados
      const duplicado = horarios.find(h => 
        h.id !== editingHorarioId &&
        h.disciplina_id === horarioFormData.disciplina_id &&
        h.dia === horarioFormData.dia &&
        ((horarioFormData.inicio >= h.inicio && horarioFormData.inicio < h.fim) ||
         (horarioFormData.fim > h.inicio && horarioFormData.fim <= h.fim) ||
         (horarioFormData.inicio <= h.inicio && horarioFormData.fim >= h.fim))
      );

      if (duplicado) {
        toast({
          title: "Erro",
          description: "Já existe um horário para esta disciplina neste dia e horário",
          variant: "destructive"
        });
        return;
      }

      const horarioData = {
        disciplina_id: horarioFormData.disciplina_id,
        dia: horarioFormData.dia,
        inicio: horarioFormData.inicio,
        fim: horarioFormData.fim,
        sala: horarioFormData.sala || null
      };

      if (editingHorarioId) {
        const { error } = await supabase
          .from('horarios')
          .update(horarioData)
          .eq('id', editingHorarioId);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário atualizado com sucesso!" });
      } else {
        const { error } = await supabase
          .from('horarios')
          .insert([horarioData]);
        
        if (error) throw error;
        toast({ title: "Sucesso", description: "Horário adicionado com sucesso!" });
      }

      resetHorarioForm();
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

  const handleEdit = (disciplina: Disciplina) => {
    setFormData({
      nome: disciplina.nome,
      codigo: disciplina.codigo,
      professor: disciplina.professor || ''
    });
    setEditingId(disciplina.id);
    setShowForm(true);
  };

  const handleEditHorario = (horario: Horario) => {
    setHorarioFormData({
      disciplina_id: horario.disciplina_id,
      dia: horario.dia,
      inicio: horario.inicio,
      fim: horario.fim,
      sala: horario.sala || ''
    });
    setEditingHorarioId(horario.id);
    setShowHorarioForm(true);
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
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteHorario = async (id: string) => {
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
    setFormData({ nome: '', codigo: '', professor: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const resetHorarioForm = () => {
    setHorarioFormData({ disciplina_id: '', dia: '', inicio: '', fim: '', sala: '' });
    setEditingHorarioId(null);
    setShowHorarioForm(false);
    setSelectedDisciplinaId('');
  };

  const getDisciplinaHorarios = (disciplinaId: string) => {
    return horarios.filter(h => h.disciplina_id === disciplinaId);
  };

  const openHorarioForm = (disciplinaId?: string) => {
    if (disciplinaId) {
      setHorarioFormData(prev => ({ ...prev, disciplina_id: disciplinaId }));
    }
    setShowHorarioForm(true);
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando disciplinas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Disciplinas</h3>
        <div className="flex gap-2">
          <Button onClick={() => setShowHorarioForm(true)} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Novo Horário
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Disciplina
          </Button>
        </div>
      </div>

      {/* Formulário de Disciplina */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? 'Editar Disciplina' : 'Nova Disciplina'}</CardTitle>
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
                <Label htmlFor="professor">Professor</Label>
                <Input
                  id="professor"
                  value={formData.professor}
                  onChange={(e) => setFormData({...formData, professor: e.target.value})}
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

      {/* Formulário de Horário */}
      {showHorarioForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingHorarioId ? 'Editar Horário' : 'Novo Horário'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleHorarioSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label>Disciplina</Label>
                <Select 
                  value={horarioFormData.disciplina_id} 
                  onValueChange={(value) => setHorarioFormData({...horarioFormData, disciplina_id: value})}
                >
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
                <Label>Dia da Semana</Label>
                <Select 
                  value={horarioFormData.dia} 
                  onValueChange={(value) => setHorarioFormData({...horarioFormData, dia: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                  <SelectContent>
                    {diasSemana.map(dia => (
                      <SelectItem key={dia} value={dia}>
                        {dia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="inicio">Hora de Início</Label>
                <Input
                  id="inicio"
                  type="time"
                  value={horarioFormData.inicio}
                  onChange={(e) => setHorarioFormData({...horarioFormData, inicio: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fim">Hora de Término</Label>
                <Input
                  id="fim"
                  type="time"
                  value={horarioFormData.fim}
                  onChange={(e) => setHorarioFormData({...horarioFormData, fim: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sala">Sala</Label>
                <Input
                  id="sala"
                  type="text"
                  value={horarioFormData.sala}
                  onChange={(e) => setHorarioFormData({...horarioFormData, sala: e.target.value})}
                  placeholder="Ex: Sala 101"
                />
              </div>

              <div className="flex items-end space-x-2 md:col-span-2 lg:col-span-3">
                <Button type="submit" disabled={isLoading}>
                  {editingHorarioId ? 'Atualizar Horário' : 'Salvar Horário'}
                </Button>
                <Button type="button" variant="outline" onClick={resetHorarioForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Disciplinas com Horários */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Disciplinas ({disciplinas.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Código</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Horários</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disciplinas.map((disciplina) => {
                const disciplinaHorarios = getDisciplinaHorarios(disciplina.id);
                const isExpanded = expandedDisciplina === disciplina.id;
                
                return (
                  <React.Fragment key={disciplina.id}>
                    <TableRow>
                      <TableCell className="font-medium">{disciplina.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{disciplina.codigo}</Badge>
                      </TableCell>
                      <TableCell>{disciplina.professor || 'Não atribuído'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {disciplinaHorarios.length} horário(s)
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setExpandedDisciplina(isExpanded ? null : disciplina.id)}
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openHorarioForm(disciplina.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-3">Horários de {disciplina.nome}</h4>
                            {disciplinaHorarios.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {disciplinaHorarios.map((horario) => (
                                  <div key={horario.id} className="bg-white p-3 rounded border">
                                    <div className="flex justify-between items-start mb-2">
                                      <div>
                                        <p className="font-medium text-sm">{horario.dia}</p>
                                        <p className="text-sm text-gray-600">
                                          {horario.inicio} - {horario.fim}
                                        </p>
                                        {horario.sala && (
                                          <p className="text-xs text-gray-500">{horario.sala}</p>
                                        )}
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleEditHorario(horario)}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => handleDeleteHorario(horario.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">Nenhum horário cadastrado para esta disciplina.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
          {disciplinas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Nenhuma disciplina encontrada
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DisciplinasTab;
