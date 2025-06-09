
import React from 'react';
import { useStudentData } from '@/hooks/useStudentData';
import StudentHeader from '@/components/student/StudentHeader';
import StudentInfoCard from '@/components/student/StudentInfoCard';
import NotasTable from '@/components/student/NotasTable';
import ScheduleTable from '@/components/student/ScheduleTable';
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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NotasTable notas={notas} />
          <ScheduleTable schedule={schedule} isLoading={false} />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
