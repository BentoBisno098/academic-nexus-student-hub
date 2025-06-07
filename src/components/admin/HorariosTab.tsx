
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Clock } from 'lucide-react';

interface Horario {
  id: string;
  disciplina_id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
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
  const [formData, setFormData] = useState({
    disciplina_id: '',
    dia: '',
    inicio: '',
    fim: '',
    turma: ''
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
      // Carregar horários
      const { data: horariosData, error: horariosError } = await supabase
        .from('horarios')
        .select(`
          id,
          disciplina_id,
          dia,
          inicio,
          fim,
          turma,
          disciplinas!horarios_disciplina_id_fkey (nome, codigo)
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
    } catch (error: any) {
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
    
    if (!formData.disciplina_id || !formData.dia || !formData.inicio || !formData.fim || !formData.turma) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('horarios')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horário adicionado com sucesso"
      });

      setFormData({
        disciplina_id: '',
        dia: '',
        inicio: '',
        fim: '',
        turma: ''
      });
      setIsDialogOpen(false);
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar horário",
        variant: "destructive"
      });
    }
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
      
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao excluir horário",
        variant: "destructive"
      });
    }
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5); // Remove segundos se houver
  };

  const getOrderIndex = (dia: string) => {
    return diasSemana.indexOf(dia);
  };

  const sortedHorarios = [...horarios].sort((a, b) => {
    const diaA = getOrderIndex(a.dia);
    const diaB = getOrderIndex(b.dia);
    
    if (diaA !== diaB) {
      return diaA - diaB;
    }
    
    return a.inicio.localeCompare(b.inicio);
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Horários
          </CardTitle>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Adicionar Horário</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Horário</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="disciplina">Disciplina</Label>
                  <Select value={formData.disciplina_id} onValueChange={(value) => setFormData({...formData, disciplina_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinas.map((disciplina) => (
                        <SelectItem key={disciplina.id} value={disciplina.id}>
                          {disciplina.nome} ({disciplina.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dia">Dia da Semana</Label>
                  <Select value={formData.dia} onValueChange={(value) => setFormData({...formData, dia: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {diasSemana.map((dia) => (
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
                    value={formData.inicio}
                    onChange={(e) => setFormData({...formData, inicio: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fim">Hora de Término</Label>
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
                    type="text"
                    value={formData.turma}
                    onChange={(e) => setFormData({...formData, turma: e.target.value})}
                    placeholder="Ex: 1A, 2B, etc."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Salvar Horário
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {sortedHorarios.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum horário cadastrado</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead>Dia</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Turma</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedHorarios.map((horario) => (
                <TableRow key={horario.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{horario.disciplinas?.nome}</p>
                      <p className="text-sm text-gray-500">{horario.disciplinas?.codigo}</p>
                    </div>
                  </TableCell>
                  <TableCell>{horario.dia}</TableCell>
                  <TableCell>
                    {formatTime(horario.inicio)} - {formatTime(horario.fim)}
                  </TableCell>
                  <TableCell>{horario.turma}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(horario.id)}
                      className="flex items-center space-x-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default HorariosTab;
