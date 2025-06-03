
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Aluno, Disciplina, NotaFormData } from './types';

interface NotaFormProps {
  formData: NotaFormData;
  setFormData: (data: NotaFormData) => void;
  alunos: Aluno[];
  disciplinas: Disciplina[];
  tipoNota: 'tradicional' | 'trimestral';
  setTipoNota: (tipo: 'tradicional' | 'trimestral') => void;
  editingId: string | null;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const NotaForm: React.FC<NotaFormProps> = ({
  formData,
  setFormData,
  alunos,
  disciplinas,
  tipoNota,
  setTipoNota,
  editingId,
  isLoading,
  onSubmit,
  onCancel
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? 'Editar Nota' : 'Nova Nota'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Aluno</Label>
              <Select value={formData.aluno_id} onValueChange={(value) => setFormData({...formData, aluno_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um aluno" />
                </SelectTrigger>
                <SelectContent>
                  {alunos.map(aluno => (
                    <SelectItem key={aluno.id} value={aluno.id}>
                      {aluno.nome} ({aluno.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <div>
              <Label htmlFor="ano_letivo">Ano Letivo</Label>
              <Input
                id="ano_letivo"
                type="number"
                min="2020"
                max="2030"
                value={formData.ano_letivo}
                onChange={(e) => setFormData({...formData, ano_letivo: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label>Tipo de Nota</Label>
            <Select value={tipoNota} onValueChange={(value: 'tradicional' | 'trimestral') => setTipoNota(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tradicional">Tradicional (P1, P2, Trabalho)</SelectItem>
                <SelectItem value="trimestral">Trimestral (Professor, Final)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {tipoNota === 'tradicional' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="prova1">Prova 1 (0-20)</Label>
                <Input
                  id="prova1"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.prova1}
                  onChange={(e) => setFormData({...formData, prova1: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="prova2">Prova 2 (0-20)</Label>
                <Input
                  id="prova2"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.prova2}
                  onChange={(e) => setFormData({...formData, prova2: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="trabalho">Trabalho (0-20)</Label>
                <Input
                  id="trabalho"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.trabalho}
                  onChange={(e) => setFormData({...formData, trabalho: e.target.value})}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Trimestre</Label>
                <Select value={formData.trimestre} onValueChange={(value) => setFormData({...formData, trimestre: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o trimestre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Trimestre</SelectItem>
                    <SelectItem value="2">2º Trimestre</SelectItem>
                    <SelectItem value="3">3º Trimestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prova_professor">Prova Professor (0-20)</Label>
                <Input
                  id="prova_professor"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.prova_professor}
                  onChange={(e) => setFormData({...formData, prova_professor: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="prova_final">Prova Final (0-20)</Label>
                <Input
                  id="prova_final"
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={formData.prova_final}
                  onChange={(e) => setFormData({...formData, prova_final: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
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

export default NotaForm;
