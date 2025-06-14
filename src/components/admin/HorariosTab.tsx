
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Horario {
  id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  sala: string;
  disciplina_id: string;
  disciplinas?: {
    nome: string;
    codigo: string;
  };
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState<Horario | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    dia: '',
    inicio: '',
    fim: '',
    turma: '',
    sala: '',
    disciplina_id: ''
  });

  const diasSemana = [
    'Segunda-feira',
    'Terça-feira', 
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];

  const turmasDisponiveis = [
    'A',
    'B', 
    'C',
    'D',
    'E',
    'F',
    'G',
    'H'
  ];

  useEffect(() => {
    loadHorarios();
    loadDisciplinas();
  }, []);

  const loadHorarios = async () => {
    try {
      const { data, error } = await supabase
        .from('horarios')
        .select(`
          *,
          disciplinas!horarios_disciplina_id_fkey (nome, codigo)
        `)
        .order('dia')
        .order('inicio');

      if (error) throw error;
      setHorarios(data || []);
    } catch (error) {
      console.error('Erro ao carregar horários:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar horários",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingHorario) {
        const { error } = await supabase
          .from('horarios')
          .update(formData)
          .eq('id', editingHorario.id);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Horário atualizado com sucesso"
        });
      } else {
        const { error } = await supabase
          .from('horarios')
          .insert([formData]);

        if (error) throw error;

        toast({
          title: "Sucesso", 
          description: "Horário criado com sucesso"
        });
      }

      resetForm();
      loadHorarios();
    } catch (error) {
      console.error('Erro ao salvar horário:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar horário",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (horario: Horario) => {
    setEditingHorario(horario);
    setFormData({
      dia: horario.dia,
      inicio: horario.inicio,
      fim: horario.fim,
      turma: horario.turma,
      sala: horario.sala || '',
      disciplina_id: horario.disciplina_id
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este horário?')) return;

    try {
      const { error } = await supabase
        .from('horarios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horário excluído com sucesso"
      });
      
      loadHorarios();
    } catch (error) {
      console.error('Erro ao excluir horário:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir horário",
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
      sala: '',
      disciplina_id: ''
    });
    setEditingHorario(null);
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">Carregando horários...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <CardTitle>Gerenciar Horários</CardTitle>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Horário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingHorario ? 'Editar Horário' : 'Novo Horário'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="dia">Dia da Semana</Label>
                    <Select value={formData.dia} onValueChange={(value) => setFormData({...formData, dia: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {diasSemana.map((dia) => (
                          <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="inicio">Hora Início</Label>
                      <Input
                        id="inicio"
                        type="time"
                        value={formData.inicio}
                        onChange={(e) => setFormData({...formData, inicio: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="fim">Hora Fim</Label>
                      <Input
                        id="fim"
                        type="time"
                        value={formData.fim}
                        onChange={(e) => setFormData({...formData, fim: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="disciplina_id">Disciplina</Label>
                    <Select value={formData.disciplina_id} onValueChange={(value) => setFormData({...formData, disciplina_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplinas.map((disciplina) => (
                          <SelectItem key={disciplina.id} value={disciplina.id}>
                            {disciplina.codigo} - {disciplina.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="turma">Turma</Label>
                    <Select value={formData.turma} onValueChange={(value) => setFormData({...formData, turma: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {turmasDisponiveis.map((turma) => (
                          <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sala">Sala</Label>
                    <Input
                      id="sala"
                      value={formData.sala}
                      onChange={(e) => setFormData({...formData, sala: e.target.value})}
                      placeholder="Ex: Sala 101, Lab 02"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingHorario ? 'Atualizar' : 'Criar'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Nenhum horário cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                horarios.map((horario) => (
                  <TableRow key={horario.id}>
                    <TableCell>{horario.dia}</TableCell>
                    <TableCell>{horario.inicio} - {horario.fim}</TableCell>
                    <TableCell>
                      {horario.disciplinas?.codigo} - {horario.disciplinas?.nome}
                    </TableCell>
                    <TableCell>{horario.turma}</TableCell>
                    <TableCell>{horario.sala || '-'}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(horario)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(horario.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default HorariosTab;
