
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

const Schedule = () => {
  const schedule = {
    segunda: [
      { disciplina: "Programação Web Avançada", horario: "08:00 - 10:00", sala: "Lab 201" },
      { disciplina: "Base de Dados II", horario: "14:00 - 16:00", sala: "Sala 305" }
    ],
    terca: [
      { disciplina: "Sistemas Distribuídos", horario: "10:00 - 12:00", sala: "Lab 102" },
      { disciplina: "Inteligência Artificial", horario: "16:00 - 18:00", sala: "Sala 210" }
    ],
    quarta: [
      { disciplina: "Programação Web Avançada", horario: "08:00 - 10:00", sala: "Lab 201" }
    ],
    quinta: [
      { disciplina: "Base de Dados II", horario: "14:00 - 16:00", sala: "Sala 305" },
      { disciplina: "Sistemas Distribuídos", horario: "10:00 - 12:00", sala: "Lab 102" }
    ],
    sexta: [
      { disciplina: "Inteligência Artificial", horario: "08:00 - 10:00", sala: "Sala 210" }
    ]
  };

  const diasSemana = [
    { key: 'segunda', nome: 'Segunda-feira' },
    { key: 'terca', nome: 'Terça-feira' },
    { key: 'quarta', nome: 'Quarta-feira' },
    { key: 'quinta', nome: 'Quinta-feira' },
    { key: 'sexta', nome: 'Sexta-feira' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Meus Horários</h1>
          <p className="text-gray-600 mt-2">Cronograma semanal de aulas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {diasSemana.map((dia) => (
            <Card key={dia.key} className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg text-center">{dia.nome}</CardTitle>
              </CardHeader>
              <CardContent>
                {schedule[dia.key as keyof typeof schedule].length > 0 ? (
                  <div className="space-y-3">
                    {schedule[dia.key as keyof typeof schedule].map((aula, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-900">{aula.disciplina}</h4>
                        <p className="text-sm text-blue-700">{aula.horario}</p>
                        <p className="text-sm text-blue-600">Sala: {aula.sala}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <p>Sem aulas programadas</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Resumo Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">18</p>
                <p className="text-sm text-gray-600">Horas/Semana</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">4</p>
                <p className="text-sm text-gray-600">Disciplinas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">8</p>
                <p className="text-sm text-gray-600">Aulas/Semana</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">5</p>
                <p className="text-sm text-gray-600">Dias Letivos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
