
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Nota {
  id: string;
  trimestre: number;
  prova_professor: number;
  prova_final: number;
  media_final: number;
  disciplina_nome: string;
  disciplina_codigo: string;
}

interface NotasTableProps {
  notas: Nota[];
}

const NotasTable = ({ notas }: NotasTableProps) => {
  const getStatusColor = (media: number) => {
    if (media >= 16) return 'bg-green-500';
    if (media >= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Minhas Notas Trimestrais
        </CardTitle>
      </CardHeader>
      <CardContent>
        {notas.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhuma nota encontrada</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead>Trimestre</TableHead>
                <TableHead>Prova Professor</TableHead>
                <TableHead>Prova Final</TableHead>
                <TableHead>Média</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notas.map((nota) => (
                <TableRow key={nota.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{nota.disciplina_nome}</p>
                      <p className="text-sm text-gray-500">{nota.disciplina_codigo}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-purple-600">
                      {nota.trimestre}º Trim
                    </Badge>
                  </TableCell>
                  <TableCell>{nota.prova_professor?.toFixed(1) || '-'}</TableCell>
                  <TableCell>{nota.prova_final?.toFixed(1) || '-'}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusColor(nota.media_final || 0)} text-white`}
                    >
                      {nota.media_final?.toFixed(1) || '-'}
                    </Badge>
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

export default NotasTable;
