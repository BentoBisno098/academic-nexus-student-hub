
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, User, Mail, Key, Phone, FileText, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NewUserGuide = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: FileText,
      title: "1. Matrícula na Universidade",
      description: "Complete o processo de matrícula presencialmente ou online nos Serviços Acadêmicos.",
      details: ["Documentos necessários", "Pagamento de taxas", "Confirmação de matrícula"]
    },
    {
      icon: User,
      title: "2. Receber Número de Aluno",
      description: "Após a matrícula, receberá um número único de 10 dígitos.",
      details: ["Número enviado por email", "Também disponível nos Serviços Acadêmicos", "Guarde este número com segurança"]
    },
    {
      icon: Mail,
      title: "3. Ativação do Email Institucional",
      description: "Ative sua conta de email da universidade.",
      details: ["Acesse o portal de ativação", "Use seu número de aluno", "Defina uma palavra-passe segura"]
    },
    {
      icon: Key,
      title: "4. Obter Credenciais do Portal",
      description: "Receberá as credenciais de acesso ao portal acadêmico.",
      details: ["Palavra-chave inicial por email ou SMS", "Altere na primeira utilização", "Mantenha suas credenciais seguras"]
    }
  ];

  const contacts = [
    {
      title: "Serviços Acadêmicos",
      phone: "+351 234 370 200",
      email: "academicos@universidade.pt",
      hours: "9h00-17h00 (Segunda a Sexta)"
    },
    {
      title: "Suporte Técnico",
      phone: "+351 234 370 300", 
      email: "suporte.ti@universidade.pt",
      hours: "8h30-18h00 (Segunda a Sexta)"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="absolute left-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Guia para Novos Utilizadores
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Como obter suas credenciais de acesso ao Portal Acadêmico
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Passos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((step, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <step.icon className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                        <ul className="space-y-1">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-center text-xs text-gray-500">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Informações Importantes */}
            <Alert>
              <AlertDescription>
                <strong>Importante:</strong> O processo completo pode demorar até 48 horas após a matrícula. 
                Se não receber suas credenciais neste período, contacte os Serviços Acadêmicos.
              </AlertDescription>
            </Alert>

            {/* Contactos */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Precisa de Ajuda?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts.map((contact, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{contact.title}</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {contact.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {contact.email}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{contact.hours}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Documentos Necessários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos Necessários para Matrícula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Estudantes Nacionais:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Cartão de Cidadão</li>
                      <li>Certificado de habilitações</li>
                      <li>Comprovativo de morada</li>
                      <li>Fotografias tipo passe</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Estudantes Internacionais:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      <li>Passaporte ou Cartão de Cidadão UE</li>
                      <li>Certificado de habilitações (traduzido)</li>
                      <li>Comprovativo de proficiência em português</li>
                      <li>Visto de estudante (se aplicável)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={() => navigate('/login')} size="lg">
                Já tenho credenciais - Fazer Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewUserGuide;
