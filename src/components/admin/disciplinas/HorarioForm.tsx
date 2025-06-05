
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Disciplina, diasSemana } from './types';

interface HorarioFormProps {
  showHorarioForm: boolean;
  editingHorarioId: string | null;
  horarioFormData: {
    disciplina_id: string;
    dia: string;
    inicio: string;
    fim: string;
    sala: string;
  };
  disciplinas: Disciplina[];
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: { disciplina_id: string; dia: string; inicio: string; fim: string; sala: string }) => void;
  onCancel: () => void;
}

const HorarioForm: React.FC<HorarioFormProps> = ({
  showHorarioForm,
  editingHorarioId,
  horarioFormData,
  disciplinas,
  isLoading,
  onSubmit,
  onFormDataChange,
  onCancel
}) => {
  if (!showHorarioForm) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingHorarioId ? 'Editar Horário' : 'Novo Horário'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Disciplina</Label>
            <Select 
              value={horarioFormData.disciplina_id} 
              onValueChange={(value) => onFormDataChange({...horarioFormData, disciplina_id: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma disciplina" />
              </SelectTrigger>
              <SelectContent>
                {disciplinas.map(disciplina => (
                  <SelectItem key={disciplina.id} value={disciplina.id}>
                    {disciplina.nome} ({disciplina.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Dia da Semana</Label>
            <Select 
              value={horarioFormData.dia} 
              onValueChange={(value) => onFormDataChange({...horarioFormData, dia: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {diasSemana.map(dia => (
                  <SelectItem key={dia} value={dia}>
                    {dia}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="inicio">Hora de Início</Label>
            <Input
              id="inicio"
              type="time"
              value={horarioFormData.inicio}
              onChange={(e) => onFormDataChange({...horarioFormData, inicio: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="fim">Hora de Término</Label>
            <Input
              id="fim"
              type="time"
              value={horarioFormData.fim}
              onChange={(e) => onFormDataChange({...horarioFormData, fim: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="sala">Sala</Label>
            <Input
              id="sala"
              type="text"
              value={horarioFormData.sala}
              onChange={(e) => onFormDataChange({...horarioFormData, sala: e.target.value})}
              placeholder="Ex: Sala 101"
            />
          </div>

          <div className="flex items-end space-x-2 md:col-span-2 lg:col-span-3">
            <Button type="submit" disabled={isLoading}>
              {editingHorarioId ? 'Atualizar Horário' : 'Salvar Horário'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default HorarioForm;
