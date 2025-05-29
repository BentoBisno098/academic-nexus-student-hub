
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Horario {
  id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplina_id: string;
  disciplinas?: { nome: string; codigo: string };
}

const HorariosTabComponent = () => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [filteredHorarios, setFilteredHorarios] = useState<Horario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTurma, setFilterTurma] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadHorarios();
  }, []);

  useEffect(() => {
    filterHorarios();
  }, [horarios, filterTurma]);

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

  const filterHorarios = () => {
    let filtered = horarios;

    if (filterTurma) {
      filtered = filtered.filter(horario => 
        horario.turma?.toLowerCase().includes(filterTurma.toLowerCase())
      );
    }

    setFilteredHorarios(filtered);
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5); // Remove seconds from time string
  };

  const getDayOrder = (dia: string) => {
    const order = {
      'Segunda': 1,
      'Terça': 2,
      'Quarta': 3,
      'Quinta': 4,
      'Sexta': 5,
      'Sábado': 6,
      'Domingo': 7
    };
    return order[dia as keyof typeof order] || 8;
  };

  const groupedHorarios = filteredHorarios.reduce((acc, horario) => {
    if (!acc[horario.turma || 'Sem turma']) {
      acc[horario.turma || 'Sem turma'] = [];
    }
    acc[horario.turma || 'Sem turma'].push(horario);
    return acc;
  }, {} as Record<string, Horario[]>);

  // Sort horarios within each turma by day and time
  Object.keys(groupedHorarios).forEach(turma => {
    groupedHorarios[turma].sort((a, b) => {
      const dayDiff = getDayOrder(a.dia) - getDayOrder(b.dia);
      if (dayDiff === 0) {
        return a.inicio.localeCompare(b.inicio);
      }
      return dayDiff;
    });
  });

  const turmas = [...new Set(horarios.map(h => h.turma).filter(Boolean))].sort();

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Horários das Turmas</h3>
        <p className="text-gray-600 mt-1">Visualizar horários organizados por turma</p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar por Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="turma-filter">Turma</Label>
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
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{filteredHorarios.length} horários encontrados</span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Horários por Turma */}
      {isLoading ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Carregando horários...
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.keys(groupedHorarios).length === 0 ? (
            <Card>
              <CardContent className="text-center py-8 text-gray-500">
                Nenhum horário encontrado
              </CardContent>
            </Card>
          ) : (
            Object.keys(groupedHorarios).sort().map(turma => (
              <Card key={turma}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Turma: {turma}</span>
                    <Badge variant="outline">
                      {groupedHorarios[turma].length} disciplinas
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Dia</th>
                          <th className="text-left p-2">Horário</th>
                          <th className="text-left p-2">Disciplina</th>
                          <th className="text-left p-2">Código</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedHorarios[turma].map((horario) => (
                          <tr key={horario.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <Badge variant="secondary">{horario.dia}</Badge>
                            </td>
                            <td className="p-2 font-mono">
                              {formatTime(horario.inicio)} - {formatTime(horario.fim)}
                            </td>
                            <td className="p-2 font-medium">
                              {horario.disciplinas?.nome || 'N/A'}
                            </td>
                            <td className="p-2">
                              <Badge variant="outline">
                                {horario.disciplinas?.codigo || 'N/A'}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default HorariosTabComponent;
