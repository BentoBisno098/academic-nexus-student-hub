
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Horario } from './types';

interface HorarioTableProps {
  horarios: Horario[];
  filterTurma: string;
  onEdit: (horario: Horario) => void;
  onDelete: (id: string) => void;
}

const HorarioTable: React.FC<HorarioTableProps> = ({
  horarios,
  filterTurma,
  onEdit,
  onDelete
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Lista de Horários ({horarios.length})
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
            {horarios.map((horario) => (
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
                      onClick={() => onEdit(horario)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(horario.id)}
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
  );
};

export default HorarioTable;
