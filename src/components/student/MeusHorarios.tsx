
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, BookOpen } from 'lucide-react';

interface HorarioItem {
  id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplina_nome: string;
  disciplina_codigo: string;
}

interface MeusHorariosProps {
  schedule: HorarioItem[];
  isLoading: boolean;
}

const MeusHorarios = ({ schedule, isLoading }: MeusHorariosProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Meus Horários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-gray-500">Carregando horários...</p>
        </CardContent>
      </Card>
    );
  }

  if (schedule.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Meus Horários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4 text-gray-500">
            Você ainda não possui horários cadastrados para sua turma.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Organizar horários por dia da semana
  const diasOrdem = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  
  const horariosPorDia = diasOrdem.reduce((acc, dia) => {
    const horariosDoDia = schedule
      .filter(horario => horario.dia === dia)
      .sort((a, b) => a.inicio.localeCompare(b.inicio));
    
    if (horariosDoDia.length > 0) {
      acc[dia] = horariosDoDia;
    }
    
    return acc;
  }, {} as Record<string, HorarioItem[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Meus Horários
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Horários das disciplinas da sua turma
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.entries(horariosPorDia).map(([dia, horarios]) => (
            <div key={dia} className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">{dia}</h3>
              <div className="grid gap-3">
                {horarios.map((horario) => (
                  <div 
                    key={horario.id} 
                    className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                          <h4 className="font-medium text-gray-900">
                            {horario.disciplina_nome}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Código: {horario.disciplina_codigo}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {horario.inicio} - {horario.fim}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            Sala: {horario.turma}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeusHorarios;
