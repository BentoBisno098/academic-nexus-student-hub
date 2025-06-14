
import React from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import StudentHeader from '@/components/student/StudentHeader';
import StudentInfoCard from '@/components/student/StudentInfoCard';
import NotasTable from '@/components/student/NotasTable';
import MeusHorarios from '@/components/student/MeusHorarios';
import LoadingSpinner from '@/components/student/LoadingSpinner';

const StudentDashboard = () => {
  const { studentData, notas, schedule, isLoading, handleLogout } = useStudentData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StudentHeader 
        studentName={studentData?.nome} 
        onLogout={handleLogout} 
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <StudentInfoCard studentData={studentData} />
        
        <div className="space-y-6">
          {/* Seção Meus Horários */}
          <MeusHorarios schedule={schedule} isLoading={isLoading} />
          
          {/* Seção Notas */}
          <NotasTable notas={notas} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
