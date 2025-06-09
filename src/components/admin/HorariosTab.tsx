import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Clock } from 'lucide-react';

interface Horario {
  id: string;
  disciplina_id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplinas: {
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const [selectedDisciplina, setSelectedDisciplina] = useState('');
  const [diaSemana, setDiaSemana] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFim, setHoraFim] = useState('');
  const [sala, setSala] = useState('');

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
        `);

      if (horariosError) throw horariosError;

      // Transform the data to match our interface
      const formattedHorarios = horariosData?.map(horario => ({
        ...horario,
        disciplinas: Array.isArray(horario.disciplinas) 
          ? horario.disciplinas[0] 
          : horario.disciplinas
      })) || [];

      setHorarios(formattedHorarios);

      // Carregar disciplinas
      const { data: disciplinasData, error: disciplinasError } = await supabase
        .from('disciplinas')
        .select('id, nome, codigo');

      if (disciplinasError) throw disciplinasError;
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
    
    try {
      const { error } = await supabase
        .from('horarios')
        .insert({
          disciplina_id: selectedDisciplina,
          dia: diaSemana,
          inicio: horaInicio,
          fim: horaFim,
          turma: sala // Using sala as turma for now
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Horário adicionado com sucesso!"
      });

      setIsModalOpen(false);
      resetForm();
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
        description: "Horário excluído com sucesso!"
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

  const resetForm = () => {
    setSelectedDisciplina('');
    setDiaSemana('');
    setHoraInicio('');
    setHoraFim('');
    setSala('');
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando horários...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Horários
          </CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Adicionar Horário</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Horário</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="disciplina">Disciplina</Label>
                  <Select value={selectedDisciplina} onValueChange={setSelectedDisciplina}>
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
                  <Select value={diaSemana} onValueChange={setDiaSemana}>
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
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fim">Hora de Término</Label>
                  <Input
                    id="fim"
                    type="time"
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="sala">Sala</Label>
                  <Input
                    id="sala"
                    value={sala}
                    onChange={(e) => setSala(e.target.value)}
                    placeholder="Ex: Sala 101"
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
        {horarios.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum horário encontrado</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead>Dia</TableHead>
                <TableHead>Início</TableHead>
                <TableHead>Término</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {horarios.map((horario) => (
                <TableRow key={horario.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{horario.disciplinas?.nome}</p>
                      <p className="text-sm text-gray-500">{horario.disciplinas?.codigo}</p>
                    </div>
                  </TableCell>
                  <TableCell>{horario.dia}</TableCell>
                  <TableCell>{horario.inicio}</TableCell>
                  <TableCell>{horario.fim}</TableCell>
                  <TableCell>{horario.turma}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(horario.id)}
                      className="text-red-600 hover:text-red-700"
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
