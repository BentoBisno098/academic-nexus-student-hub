
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const Subjects = () => {
  const subjects = [
    {
      id: 1,
      name: "Programação Web Avançada",
      professor: "Prof. João Silva",
      sala: "Lab 201",
      cargaHoraria: "60h",
      periodo: "3º Período",
      status: "Em Andamento"
    },
    {
      id: 2,
      name: "Base de Dados II",
      professor: "Prof. Maria Santos",
      sala: "Sala 305",
      cargaHoraria: "80h",
      periodo: "3º Período",
      status: "Em Andamento"
    },
    {
      id: 3,
      name: "Sistemas Distribuídos",
      professor: "Prof. Carlos Oliveira",
      sala: "Lab 102",
      cargaHoraria: "60h",
      periodo: "3º Período",
      status: "Em Andamento"
    },
    {
      id: 4,
      name: "Inteligência Artificial",
      professor: "Prof. Ana Costa",
      sala: "Sala 210",
      cargaHoraria: "80h",
      periodo: "3º Período",
      status: "Em Andamento"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Disciplinas</h1>
          <p className="text-gray-600 mt-2">Disciplinas em que você está inscrito neste período</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <Badge variant="outline">{subject.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Professor:</span>
                    <span className="font-medium">{subject.professor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sala:</span>
                    <span className="font-medium">{subject.sala}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Carga Horária:</span>
                    <span className="font-medium">{subject.cargaHoraria}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Período:</span>
                    <span className="font-medium">{subject.periodo}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
