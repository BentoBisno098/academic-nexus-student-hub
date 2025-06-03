
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import { Nota } from './types';
import { getStatusColor, getTipoNotaBadge } from './notaUtils';

interface NotasTableProps {
  notas: Nota[];
  onEdit: (nota: Nota) => void;
  onDelete: (id: string) => void;
}

const NotasTable: React.FC<NotasTableProps> = ({ notas, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Notas ({notas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Detalhes</TableHead>
              <TableHead>Média Final</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notas.map((nota) => {
              const { isTradicional, tipo } = getTipoNotaBadge(nota);
              return (
                <TableRow key={nota.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{nota.aluno?.nome}</p>
                      <p className="text-sm text-gray-500">{nota.aluno?.codigo}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{nota.disciplina?.nome}</p>
                      <p className="text-sm text-gray-500">{nota.disciplina?.codigo}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={isTradicional ? "text-blue-600" : "text-purple-600"}>
                      {tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>{nota.ano_letivo || '-'}</TableCell>
                  <TableCell>
                    {isTradicional ? (
                      <div className="text-sm">
                        <p>P1: {nota.prova1 || '-'}</p>
                        <p>P2: {nota.prova2 || '-'}</p>
                        <p>Trab: {nota.trabalho || '-'}</p>
                      </div>
                    ) : (
                      <div className="text-sm">
                        <p>Trim: {nota.trimestre}º</p>
                        <p>Prof: {nota.prova_professor || '-'}</p>
                        <p>Final: {nota.prova_final || '-'}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(nota.media_final || 0)} text-white`}>
                      {nota.media_final?.toFixed(1) || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(nota)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(nota.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {notas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma nota encontrada
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotasTable;
