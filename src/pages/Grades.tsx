
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Navigation from '@/components/Navigation';

const Grades = () => {
  const grades = [
    {
      disciplina: "Programação Web Avançada",
      prova1: 8.5,
      prova2: 7.2,
      trabalho1: 9.0,
      trabalho2: 8.8,
      media: 8.4,
      situacao: "Aprovado"
    },
    {
      disciplina: "Base de Dados II",
      prova1: 6.8,
      prova2: 7.5,
      trabalho1: 8.2,
      trabalho2: 7.9,
      media: 7.6,
      situacao: "Aprovado"
    },
    {
      disciplina: "Sistemas Distribuídos",
      prova1: 5.5,
      prova2: 6.8,
      trabalho1: 7.0,
      trabalho2: 6.5,
      media: 6.5,
      situacao: "Aprovado"
    },
    {
      disciplina: "Inteligência Artificial",
      prova1: 4.2,
      prova2: 5.8,
      trabalho1: 6.0,
      trabalho2: 5.5,
      media: 5.4,
      situacao: "Reprovado"
    }
  ];

  const getStatusBadge = (situacao: string) => {
    return situacao === "Aprovado" 
      ? <Badge className="bg-green-100 text-green-800">Aprovado</Badge>
      : <Badge variant="destructive">Reprovado</Badge>;
  };

  const getMediaColor = (media: number) => {
    return media >= 7 ? "text-green-600 font-semibold" : 
           media >= 5 ? "text-yellow-600 font-semibold" : 
           "text-red-600 font-semibold";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Notas</h1>
          <p className="text-gray-600 mt-2">Acompanhe seu desempenho acadêmico</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Boletim - 3º Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead className="text-center">Prova 1</TableHead>
                    <TableHead className="text-center">Prova 2</TableHead>
                    <TableHead className="text-center">Trabalho 1</TableHead>
                    <TableHead className="text-center">Trabalho 2</TableHead>
                    <TableHead className="text-center">Média Final</TableHead>
                    <TableHead className="text-center">Situação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{grade.disciplina}</TableCell>
                      <TableCell className="text-center">{grade.prova1}</TableCell>
                      <TableCell className="text-center">{grade.prova2}</TableCell>
                      <TableCell className="text-center">{grade.trabalho1}</TableCell>
                      <TableCell className="text-center">{grade.trabalho2}</TableCell>
                      <TableCell className={`text-center ${getMediaColor(grade.media)}`}>
                        {grade.media}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(grade.situacao)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-green-800">Aprovações</h3>
                  <p className="text-2xl font-bold text-green-600">3</p>
                </CardContent>
              </Card>
              
              <Card className="bg-red-50">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-red-800">Reprovações</h3>
                  <p className="text-2xl font-bold text-red-600">1</p>
                </CardContent>
              </Card>
              
              <Card className="bg-blue-50">
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-blue-800">Média Geral</h3>
                  <p className="text-2xl font-bold text-blue-600">7.0</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Grades;
