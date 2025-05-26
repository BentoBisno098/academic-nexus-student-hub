
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, File, Image } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Materials = () => {
  const materials = [
    {
      disciplina: "Programação Web Avançada",
      arquivos: [
        { nome: "Introdução ao React.pdf", tipo: "pdf", tamanho: "2.5 MB", data: "2024-01-15" },
        { nome: "Exercícios Práticos.zip", tipo: "zip", tamanho: "5.2 MB", data: "2024-01-18" },
        { nome: "Slides Aula 01.pptx", tipo: "pptx", tamanho: "8.1 MB", data: "2024-01-20" }
      ]
    },
    {
      disciplina: "Base de Dados II",
      arquivos: [
        { nome: "Modelagem Avançada.pdf", tipo: "pdf", tamanho: "3.8 MB", data: "2024-01-12" },
        { nome: "Scripts SQL.sql", tipo: "sql", tamanho: "0.8 MB", data: "2024-01-16" },
        { nome: "Diagrama ER.png", tipo: "png", tamanho: "1.2 MB", data: "2024-01-19" }
      ]
    },
    {
      disciplina: "Sistemas Distribuídos",
      arquivos: [
        { nome: "Arquiteturas Distribuídas.pdf", tipo: "pdf", tamanho: "4.2 MB", data: "2024-01-14" },
        { nome: "Código Exemplo RPC.java", tipo: "java", tamanho: "0.5 MB", data: "2024-01-17" }
      ]
    },
    {
      disciplina: "Inteligência Artificial",
      arquivos: [
        { nome: "Introdução à IA.pdf", tipo: "pdf", tamanho: "6.5 MB", data: "2024-01-13" },
        { nome: "Algoritmos Genéticos.py", tipo: "py", tamanho: "1.1 MB", data: "2024-01-21" },
        { nome: "Dataset Exemplo.csv", tipo: "csv", tamanho: "2.8 MB", data: "2024-01-22" }
      ]
    }
  ];

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case 'pdf':
      case 'pptx':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'png':
      case 'jpg':
        return <Image className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleDownload = (arquivo: string) => {
    // Simulação de download
    alert(`Download iniciado: ${arquivo}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Materiais de Apoio</h1>
          <p className="text-gray-600 mt-2">Acesse os materiais disponibilizados pelos professores</p>
        </div>

        <div className="space-y-6">
          {materials.map((disciplina, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{disciplina.disciplina}</span>
                  <Badge variant="outline">{disciplina.arquivos.length} arquivos</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {disciplina.arquivos.map((arquivo, fileIndex) => (
                    <div key={fileIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(arquivo.tipo)}
                        <div>
                          <h4 className="font-medium">{arquivo.nome}</h4>
                          <p className="text-sm text-gray-600">
                            {arquivo.tamanho} • Adicionado em {new Date(arquivo.data).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(arquivo.nome)}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Estatísticas de Materiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-600">Total de Arquivos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">34.5 MB</p>
                <p className="text-sm text-gray-600">Tamanho Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">4</p>
                <p className="text-sm text-gray-600">Disciplinas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">8</p>
                <p className="text-sm text-gray-600">Últimos 7 dias</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Materials;
