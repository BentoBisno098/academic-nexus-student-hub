
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Horario {
  id: string;
  disciplina_id: string;
  dia: string;
  inicio: string;
  fim: string;
  sala?: string;
  disciplina?: { nome: string; codigo: string };
}

interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
}

const HorariosTab = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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
      // Carregar horários com joins
      const { data: horariosData, error: horariosError } = await supabase
        .from('horarios')
        .select(`
          *,
          disciplinas!horarios_disciplina_id_fkey(nome, codigo)
        `)
        .order('dia', { ascending: true });

      if (horariosError) throw horariosError;

      // Transformar dados para o formato esperado
      const transformedHorarios = horariosData?.map(h => ({
        ...h,
        disciplina: h.disciplinas ? {
          nome: h.disciplinas.nome,
          codigo: h.disciplinas.codigo
        } : undefined
      })) || [];

      // Carregar disciplinas
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('id, nome, codigo')
        .order('nome');

      if (disciplinasError) throw disciplinasError;

      setHorarios(transformedHorarios);
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

  const validateForm = () => {
    if (!formData.disciplina_id || !formData.dia || !formData.inicio || !formData.fim) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos",
        variant: "destructive"
      });
      return false;
    }

    if (formData.fim <= formData.inicio) {
      toast({
        title: "Erro",
        description: "A hora de término deve ser maior que a hora de início",
        variant: "destructive"
      });
      return false;
    }

    // Verificar duplicidade
    const duplicado = horarios.find(h => 
      h.id !== editingId &&
      h.disciplina_id === formData.disciplina_id &&
      h.dia === formData.dia &&
      ((formData.inicio >= h.inicio && formData.inicio < h.fim) ||
       (formData.fim > h.inicio && formData.fim <= h.fim) ||
       (formData.inicio <= h.inicio && formData.fim >= h.fim))
    );

    if (duplicado) {
      toast({
        title: "Erro",
        description: "Já existe um horário para esta disciplina neste dia e horário",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const horarioData = {
        disciplina_id: formData.disciplina_id,
        dia: formData.dia,
        inicio: formData.inicio,
        fim: formData.fim,
        sala: formData.sala || null
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
        toast({ title: "Sucesso", description: "Horário cadastrado com sucesso!" });
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
      dia: horario.dia,
      inicio: horario.inicio,
      fim: horario.fim,
      sala: horario.sala || ''
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
      disciplina_id: '',
      dia: '',
      inicio: '',
      fim: '',
      sala: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando horários...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Gerenciar Horários</h3>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Novo Horário
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
                <Label>Disciplina *</Label>
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
                <Label>Dia da Semana *</Label>
                <Select value={formData.dia} onValueChange={(value) => setFormData({...formData, dia: value})}>
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
                <Label htmlFor="inicio">Hora de Início *</Label>
                <Input
                  id="inicio"
                  type="time"
                  value={formData.inicio}
                  onChange={(e) => setFormData({...formData, inicio: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fim">Hora de Término *</Label>
                <Input
                  id="fim"
                  type="time"
                  value={formData.fim}
                  onChange={(e) => setFormData({...formData, fim: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="sala">Sala</Label>
                <Input
                  id="sala"
                  type="text"
                  value={formData.sala}
                  onChange={(e) => setFormData({...formData, sala: e.target.value})}
                  placeholder="Ex: Sala 101"
                />
              </div>

              <div className="flex items-end space-x-2 md:col-span-2 lg:col-span-3">
                <Button type="submit" disabled={isLoading}>
                  {editingId ? 'Atualizar' : 'Salvar'}
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
          <CardTitle>Lista de Horários ({horarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead>Dia da Semana</TableHead>
                <TableHead>Hora de Início</TableHead>
                <TableHead>Hora de Término</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horarios.map((horario) => (
                <TableRow key={horario.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{horario.disciplina?.nome}</p>
                      <p className="text-sm text-gray-500">{horario.disciplina?.codigo}</p>
                    </div>
                  </TableCell>
                  <TableCell>{horario.dia}</TableCell>
                  <TableCell>{horario.inicio}</TableCell>
                  <TableCell>{horario.fim}</TableCell>
                  <TableCell>{horario.sala || '-'}</TableCell>
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
          {horarios.length === 0 && (
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
