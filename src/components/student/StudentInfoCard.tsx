
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

interface StudentData {
  id: string;
  nome: string;
  codigo: string;
  curso: string;
  turma: string;
  idade: number;
}

interface StudentInfoCardProps {
  studentData: StudentData | null;
}

const StudentInfoCard = ({ studentData }: StudentInfoCardProps) => {
  if (!studentData) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{studentData.nome}</h2>
            <p className="text-gray-600">Código: {studentData.codigo}</p>
            <p className="text-gray-600">{studentData.curso} - {studentData.turma}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentInfoCard;
