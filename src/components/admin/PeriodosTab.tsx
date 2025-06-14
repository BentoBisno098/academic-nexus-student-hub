
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface Periodo {
  id: string;
  nome: string;
  descricao: string;
  ativo: boolean;
  created_at: string;
}

const PeriodosTab = () => {
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    ativo: true
  });

  useEffect(() => {
    loadPeriodos();
  }, []);

  const loadPeriodos = async () => {
    try {
      const { data, error } = await supabase
        .from('periodos')
        .select('*')
        .order('nome');

      if (error) throw error;
      setPeriodos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar períodos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar períodos",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      toast({
        title: "Erro",
        description: "Nome do período é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('periodos')
          .update({
            nome: formData.nome.trim(),
            descricao: formData.descricao.trim(),
            ativo: formData.ativo,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Período atualizado com sucesso!"
        });
      } else {
        const { error } = await supabase
          .from('periodos')
          .insert({
            nome: formData.nome.trim(),
            descricao: formData.descricao.trim(),
            ativo: formData.ativo
          });

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Período adicionado com sucesso!"
        });
      }

      setIsModalOpen(false);
      resetForm();
      loadPeriodos();
    } catch (error: any) {
      console.error('Erro ao salvar período:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar período",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (periodo: Periodo) => {
    setFormData({
      nome: periodo.nome,
      descricao: periodo.descricao || '',
      ativo: periodo.ativo
    });
    setEditingId(periodo.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este período?')) return;

    try {
      const { error } = await supabase
        .from('periodos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Período excluído com sucesso!"
      });

      loadPeriodos();
    } catch (error: any) {
      console.error('Erro ao excluir período:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir período",
        variant: "destructive"
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('periodos')
        .update({ 
          ativo: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Período ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`
      });

      loadPeriodos();
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do período",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      ativo: true
    });
    setEditingId(null);
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando períodos...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Períodos
          </CardTitle>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Adicionar Período</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? 'Editar Período' : 'Adicionar Novo Período'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Período</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Manhã, Tarde, Noite"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    placeholder="Descrição do período"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativo"
                    checked={formData.ativo}
                    onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                  />
                  <Label htmlFor="ativo">Período ativo</Label>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingId ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {periodos.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhum período encontrado</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {periodos.map((periodo) => (
                <TableRow key={periodo.id}>
                  <TableCell className="font-medium">{periodo.nome}</TableCell>
                  <TableCell>{periodo.descricao || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={periodo.ativo}
                        onCheckedChange={() => toggleStatus(periodo.id, periodo.ativo)}
                      />
                      <span className={`text-sm ${periodo.ativo ? 'text-green-600' : 'text-red-600'}`}>
                        {periodo.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(periodo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(periodo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PeriodosTab;
