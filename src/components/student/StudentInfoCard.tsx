
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, GraduationCap, Clock, BookOpen, MapPin, Calendar } from 'lucide-react';

interface StudentData {
  id: string;
  nome: string;
  codigo: string;
  curso: string;
  turma: string;
  sala?: string;
  idade: number;
  periodo?: string;
  periodos?: {
    nome: string;
  };
}

interface StudentInfoCardProps {
  studentData: StudentData | null;
}

const StudentInfoCard = ({ studentData }: StudentInfoCardProps) => {
  if (!studentData) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Carregando informações...</p>
        </CardContent>
      </Card>
    );
  }

  const periodo = studentData.periodos?.nome || studentData.periodo;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-blue-600" />
            <div>
              <CardTitle className="text-xl">{studentData.nome}</CardTitle>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <span className="mr-4">Turma: {studentData.turma}</span>
                {studentData.sala && (
                  <span className="flex items-center mr-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    Sala: {studentData.sala}
                  </span>
                )}
                {periodo && (
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {periodo}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Código</p>
              <p className="text-lg font-semibold text-gray-900">{studentData.codigo}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <GraduationCap className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Curso</p>
              <p className="text-lg font-semibold text-gray-900">{studentData.curso}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <Clock className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-gray-700">Idade</p>
              <p className="text-lg font-semibold text-gray-900">{studentData.idade} anos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentInfoCard;
