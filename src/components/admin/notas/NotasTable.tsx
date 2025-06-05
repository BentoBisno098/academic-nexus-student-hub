
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { Nota } from './types';
import { getStatusColor } from './notaUtils';

interface NotasTableProps {
  notas: Nota[];
  onDelete: (id: string) => void;
}

const NotasTable: React.FC<NotasTableProps> = ({ notas, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de Notas Trimestrais ({notas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Trimestre</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Prova Professor</TableHead>
              <TableHead>Prova Final</TableHead>
              <TableHead>Média</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notas.map((nota) => {
              const media = nota.prova_professor && nota.prova_final 
                ? (nota.prova_professor + nota.prova_final) / 2
                : null;
              
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
                    <Badge variant="outline" className="text-purple-600">
                      {nota.trimestre}º Trimestre
                    </Badge>
                  </TableCell>
                  <TableCell>{nota.ano_letivo || '-'}</TableCell>
                  <TableCell>{nota.prova_professor || '-'}</TableCell>
                  <TableCell>{nota.prova_final || '-'}</TableCell>
                  <TableCell>
                    {media !== null ? (
                      <Badge className={`${getStatusColor(media)} text-white`}>
                        {media.toFixed(1)}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onDelete(nota.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
