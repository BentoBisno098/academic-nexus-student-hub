
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const Profile = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "Ana Silva",
    numeroAluno: "1234567890",
    curso: "Engenharia Informática",
    turma: "EI-3A",
    ano: "3º Ano",
    email: "ana.silva@estudante.universidade.pt",
    telefone: "+351 912 345 678",
    endereco: "Rua das Flores, 123, Lisboa"
  });

  const [senhaData, setSenhaData] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: ""
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil Atualizado",
      description: "Suas informações foram atualizadas com sucesso!"
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (senhaData.novaSenha !== senhaData.confirmarSenha) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Senha Alterada",
      description: "Sua senha foi alterada com sucesso!"
    });
    setSenhaData({ senhaAtual: "", novaSenha: "", confirmarSenha: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e configurações da conta</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Perfil */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="numeroAluno">Número de Aluno</Label>
                      <Input
                        id="numeroAluno"
                        value={formData.numeroAluno}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="curso">Curso</Label>
                      <Input
                        id="curso"
                        value={formData.curso}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="turma">Turma</Label>
                      <Input
                        id="turma"
                        value={formData.turma}
                        disabled
                        className="bg-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Atualizar Informações
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Alteração de Senha */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="senhaAtual">Senha Atual</Label>
                    <Input
                      id="senhaAtual"
                      type="password"
                      value={senhaData.senhaAtual}
                      onChange={(e) => setSenhaData({...senhaData, senhaAtual: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="novaSenha">Nova Senha</Label>
                    <Input
                      id="novaSenha"
                      type="password"
                      value={senhaData.novaSenha}
                      onChange={(e) => setSenhaData({...senhaData, novaSenha: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                    <Input
                      id="confirmarSenha"
                      type="password"
                      value={senhaData.confirmarSenha}
                      onChange={(e) => setSenhaData({...senhaData, confirmarSenha: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Alterar Senha
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Perfil */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="text-lg">AS</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{formData.nome}</h3>
                <p className="text-gray-600">{formData.numeroAluno}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.curso} - {formData.ano}
                </p>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Estatísticas Acadêmicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Período Atual:</span>
                    <span className="font-medium">3º Período</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Disciplinas:</span>
                    <span className="font-medium">4 ativas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Média Geral:</span>
                    <span className="font-medium text-green-600">7.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Regular</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
