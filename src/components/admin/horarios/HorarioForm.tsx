
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HorarioFormData, Disciplina } from './types';

interface HorarioFormProps {
  formData: HorarioFormData;
  setFormData: (data: HorarioFormData) => void;
  disciplinas: Disciplina[];
  isLoading: boolean;
  editingId: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const HorarioForm: React.FC<HorarioFormProps> = ({
  formData,
  setFormData,
  disciplinas,
  isLoading,
  editingId,
  onSubmit,
  onCancel
}) => {
  const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? 'Editar Horário' : 'Novo Horário'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Dia da Semana</Label>
            <Select value={formData.dia} onValueChange={(value) => setFormData({...formData, dia: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {diasSemana.map(dia => (
                  <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="inicio">Hora de Início</Label>
            <Input
              id="inicio"
              type="time"
              value={formData.inicio}
              onChange={(e) => setFormData({...formData, inicio: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="fim">Hora de Fim</Label>
            <Input
              id="fim"
              type="time"
              value={formData.fim}
              onChange={(e) => setFormData({...formData, fim: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="turma">Turma</Label>
            <Input
              id="turma"
              value={formData.turma}
              onChange={(e) => setFormData({...formData, turma: e.target.value})}
              required
            />
          </div>
          <div>
            <Label>Disciplina</Label>
            <Select value={formData.disciplina_id} onValueChange={(value) => setFormData({...formData, disciplina_id: value})}>
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
          <div className="flex items-end space-x-2">
            <Button type="submit" disabled={isLoading}>
              {editingId ? 'Atualizar' : 'Adicionar'}
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
