
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Disciplina } from './types';

interface DisciplinaFormProps {
  showForm: boolean;
  editingId: string | null;
  formData: {
    nome: string;
    codigo: string;
    professor: string;
  };
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onFormDataChange: (data: { nome: string; codigo: string; professor: string }) => void;
  onCancel: () => void;
}

const DisciplinaForm: React.FC<DisciplinaFormProps> = ({
  showForm,
  editingId,
  formData,
  isLoading,
  onSubmit,
  onFormDataChange,
  onCancel
}) => {
  if (!showForm) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? 'Editar Disciplina' : 'Nova Disciplina'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => onFormDataChange({...formData, nome: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => onFormDataChange({...formData, codigo: e.target.value})}
              required
            />
          </div>
          <div>
            <Label htmlFor="professor">Professor</Label>
            <Input
              id="professor"
              value={formData.professor}
              onChange={(e) => onFormDataChange({...formData, professor: e.target.value})}
            />
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

export default DisciplinaForm;
