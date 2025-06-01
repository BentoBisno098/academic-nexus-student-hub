
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HorarioFiltersProps {
  filterTurma: string;
  setFilterTurma: (turma: string) => void;
  uniqueTurmas: string[];
}

const HorarioFilters: React.FC<HorarioFiltersProps> = ({
  filterTurma,
  setFilterTurma,
  uniqueTurmas
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={filterTurma} onValueChange={setFilterTurma}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por turma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as turmas</SelectItem>
              {uniqueTurmas.map(turma => (
                <SelectItem key={turma} value={turma}>{turma}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default HorarioFilters;
