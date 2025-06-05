
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Disciplina } from './types';

interface DisciplinasListProps {
  disciplinas: Disciplina[];
  onEditDisciplina: (disciplina: Disciplina) => void;
  onDeleteDisciplina: (id: string) => void;
}

const DisciplinasList: React.FC<DisciplinasListProps> = ({
  disciplinas,
  onEditDisciplina,
  onDeleteDisciplina
}) => {
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
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disciplinas.map((disciplina) => (
              <TableRow key={disciplina.id}>
                <TableCell className="font-medium">{disciplina.nome}</TableCell>
                <TableCell>{disciplina.codigo}</TableCell>
                <TableCell>{disciplina.professor || '-'}</TableCell>
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
            ))}
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
