
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  FileText, 
  HelpCircle,
  BookOpen,
  Users
} from 'lucide-react';
import Navigation from '@/components/Navigation';

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqItems = [
    {
      question: "Como recuperar minha palavra-chave?",
      answer: "Você pode recuperar sua palavra-chave clicando no link 'Recuperar Palavra-chave' na página de login. Será necessário fornecer seu número de aluno e email institucional.",
      category: "autenticacao"
    },
    {
      question: "Como visualizar minhas notas?",
      answer: "Acesse a seção 'Notas' no menu principal. Lá você encontrará todas as suas avaliações organizadas por disciplina e período letivo.",
      category: "academico"
    },
    {
      question: "Como candidatar-me a um curso?",
      answer: "Vá para a seção 'Candidaturas', encontre o curso desejado e clique em 'Candidatar-me'. Preencha o formulário com sua motivação e experiência relevante.",
      category: "candidaturas"
    },
    {
      question: "Onde encontro os materiais das disciplinas?",
      answer: "Os materiais estão disponíveis na seção 'Materiais'. Eles são organizados por disciplina e disponibilizados pelos docentes.",
      category: "materiais"
    },
    {
      question: "Como consultar meu horário de aulas?",
      answer: "Acesse a seção 'Horários' para visualizar seu cronograma semanal de aulas, incluindo horários, salas e docentes.",
      category: "horarios"
    }
  ];

  const glossaryItems = [
    { term: "ECTS", definition: "European Credit Transfer System - Sistema de créditos europeu para transferência de estudos" },
    { term: "UC", definition: "Unidade Curricular - Disciplina do plano de estudos" },
    { term: "Menor", definition: "Conjunto de unidades curriculares que complementam a formação principal" },
    { term: "Candidatura", definition: "Processo de inscrição em cursos, mestrados ou programas especiais" },
    { term: "Avaliação Contínua", definition: "Sistema de avaliação baseado em múltiplas atividades ao longo do semestre" }
  ];

  const supportContacts = [
    {
      title: "Serviços Acadêmicos",
      phone: "+351 234 370 200",
      email: "academicos@universidade.pt",
      hours: "9h00-17h00 (Segunda a Sexta)",
      location: "Edifício Central, Piso 1"
    },
    {
      title: "Suporte Técnico",
      phone: "+351 234 370 300",
      email: "suporte.ti@universidade.pt",
      hours: "8h30-18h00 (Segunda a Sexta)",
      location: "Centro de Informática"
    },
    {
      title: "Apoio ao Estudante",
      phone: "+351 234 370 150",
      email: "apoio.estudante@universidade.pt",
      hours: "9h00-16h00 (Segunda a Sexta)",
      location: "Serviços Sociais"
    }
  ];

  const articles = [
    {
      title: "Como navegar no Portal Acadêmico",
      description: "Guia completo para utilizar todas as funcionalidades da plataforma",
      category: "tutorial",
      readTime: "5 min"
    },
    {
      title: "Processo de Candidaturas Passo-a-Passo",
      description: "Instruções detalhadas para candidatar-se a cursos e programas",
      category: "candidaturas", 
      readTime: "8 min"
    },
    {
      title: "Gestão de Perfil e Dados Pessoais",
      description: "Como atualizar suas informações pessoais e preferências",
      category: "perfil",
      readTime: "3 min"
    }
  ];

  const filteredFaq = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ajuda e Suporte</h1>
          <p className="text-gray-600">Encontre respostas, artigos e informações de contato</p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar na ajuda..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Artigos de Ajuda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Artigos de Ajuda
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {articles.map((article, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 hover:bg-gray-50 p-2 rounded cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{article.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{article.description}</p>
                        </div>
                        <Badge variant="outline">{article.readTime}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Perguntas Frequentes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {filteredFaq.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Glossário */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Glossário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {glossaryItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-2 last:border-b-0">
                      <dt className="font-semibold text-blue-600">{item.term}</dt>
                      <dd className="text-gray-600 text-sm mt-1">{item.definition}</dd>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações de Contato */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Contactos de Suporte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supportContacts.map((contact, index) => (
                    <div key={index} className="border rounded-lg p-3">
                      <h3 className="font-semibold text-sm mb-2">{contact.title}</h3>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-2" />
                          {contact.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-2" />
                          {contact.email}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-2" />
                          {contact.hours}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-2" />
                          {contact.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requisitos do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Requisitos do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <div>
                  <strong>Navegadores Suportados:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600">
                    <li>Firefox (versão 60+)</li>
                    <li>Chrome (versão 70+)</li>
                    <li>Internet Explorer 11</li>
                  </ul>
                </div>
                <div>
                  <strong>Recomendações:</strong>
                  <ul className="list-disc list-inside mt-1 text-gray-600">
                    <li>JavaScript ativado</li>
                    <li>Modo paisagem (mobile)</li>
                    <li>Resolução mínima 1024x768</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
