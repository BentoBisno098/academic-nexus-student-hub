
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import InstallButton from '@/components/InstallButton';

interface StudentHeaderProps {
  studentName?: string;
  onLogout: () => void;
}

const StudentHeader = ({ studentName, onLogout }: StudentHeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">Portal do Aluno</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Bem-vindo, {studentName}
            </span>
            <InstallButton />
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
