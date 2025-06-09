
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock } from 'lucide-react';

interface ScheduleItem {
  id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplina_nome: string;
  disciplina_codigo: string;
}

interface ScheduleTableProps {
  schedule: ScheduleItem[];
  isLoading: boolean;
}

const ScheduleTable = ({ schedule, isLoading }: ScheduleTableProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Horários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">Carregando horários...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Horários da Turma
        </CardTitle>
      </CardHeader>
      <CardContent>
        {schedule.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum horário encontrado para sua turma
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Horário</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Código</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.dia}</TableCell>
                  <TableCell>{item.inicio} - {item.fim}</TableCell>
                  <TableCell>{item.disciplina_nome}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {item.disciplina_codigo}
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

export default ScheduleTable;
