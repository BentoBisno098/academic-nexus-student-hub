
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GraduationCap, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  const availableCourses = [
    {
      id: 1,
      name: "Mestrado em Inteligência Artificial",
      type: "Mestrado",
      duration: "2 anos",
      deadline: "2024-07-15",
      description: "Programa avançado focado em machine learning, deep learning e aplicações de IA.",
      requirements: ["Licenciatura em área relacionada", "Média mínima de 14 valores"],
      status: "open"
    },
    {
      id: 2,
      name: "Curso de Verão - Cibersegurança",
      type: "Curso Livre",
      duration: "1 mês",
      deadline: "2024-06-30",
      description: "Curso intensivo sobre segurança informática e proteção de dados.",
      requirements: ["Conhecimentos básicos de informática"],
      status: "open"
    },
    {
      id: 3,
      name: "Menor em Gestão Empresarial",
      type: "Menor",
      duration: "1 semestre",
      deadline: "2024-08-20",
      description: "Complemento formativo em gestão e empreendedorismo.",
      requirements: ["Estar matriculado numa licenciatura"],
      status: "open"
    }
  ];

  const myApplications = [
    {
      id: 1,
      courseName: "Mestrado em Ciência de Dados",
      submittedDate: "2024-03-15",
      status: "pending",
      statusLabel: "Em Análise"
    },
    {
      id: 2,
      courseName: "Curso de Blockchain",
      submittedDate: "2024-02-28",
      status: "approved",
      statusLabel: "Aprovada"
    }
  ];

  const handleApplicationSubmit = (courseId: number, courseName: string) => {
    toast({
      title: "Candidatura Enviada",
      description: `Sua candidatura para ${courseName} foi enviada com sucesso!`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.type.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidaturas</h1>
          <p className="text-gray-600">Candidate-se a cursos, mestrados e programas disponíveis</p>
        </div>

        {/* Minhas Candidaturas */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Minhas Candidaturas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myApplications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{application.courseName}</h3>
                    <Badge className={getStatusColor(application.status)}>
                      {application.statusLabel}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Submetida em: {new Date(application.submittedDate).toLocaleDateString('pt-PT')}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={selectedCategory === 'mestrado' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('mestrado')}
                size="sm"
              >
                Mestrados
              </Button>
              <Button
                variant={selectedCategory === 'menor' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('menor')}
                size="sm"
              >
                Menores
              </Button>
              <Button
                variant={selectedCategory === 'curso livre' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('curso livre')}
                size="sm"
              >
                Cursos Livres
              </Button>
            </div>
          </div>
        </div>

        {/* Cursos Disponíveis */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Cursos Disponíveis</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="h-fit">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{course.type}</Badge>
                        <Badge variant="outline">{course.duration}</Badge>
                      </div>
                    </div>
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Requisitos:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {course.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      Prazo: {new Date(course.deadline).toLocaleDateString('pt-PT')}
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Candidatar-me</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Candidatura - {course.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="motivation">Carta de Motivação</Label>
                            <Textarea
                              id="motivation"
                              placeholder="Descreva a sua motivação para este curso..."
                              className="min-h-[100px]"
                            />
                          </div>
                          <div>
                            <Label htmlFor="experience">Experiência Relevante</Label>
                            <Textarea
                              id="experience"
                              placeholder="Descreva a sua experiência relevante..."
                              className="min-h-[80px]"
                            />
                          </div>
                          <Button 
                            className="w-full"
                            onClick={() => handleApplicationSubmit(course.id, course.name)}
                          >
                            Enviar Candidatura
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Applications;
