
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { Disciplina, Horario } from './types';

interface DisciplinasListProps {
  disciplinas: Disciplina[];
  horarios: Horario[];
  expandedDisciplina: string | null;
  onExpandDisciplina: (id: string | null) => void;
  onEditDisciplina: (disciplina: Disciplina) => void;
  onDeleteDisciplina: (id: string) => void;
  onEditHorario: (horario: Horario) => void;
  onDeleteHorario: (id: string) => void;
  onOpenHorarioForm: (disciplinaId?: string) => void;
}

const DisciplinasList: React.FC<DisciplinasListProps> = ({
  disciplinas,
  horarios,
  expandedDisciplina,
  onExpandDisciplina,
  onEditDisciplina,
  onDeleteDisciplina,
  onEditHorario,
  onDeleteHorario,
  onOpenHorarioForm
}) => {
  const getDisciplinaHorarios = (disciplinaId: string) => {
    return horarios.filter(h => h.disciplina_id === disciplinaId);
  };

  return (
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
                          onClick={() => onExpandDisciplina(isExpanded ? null : disciplina.id)}
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenHorarioForm(disciplina.id)}
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
                          onClick={() => onEditDisciplina(disciplina)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDeleteDisciplina(disciplina.id)}
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
                                        onClick={() => onEditHorario(horario)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => onDeleteHorario(horario.id)}
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
  );
};

export default DisciplinasList;
