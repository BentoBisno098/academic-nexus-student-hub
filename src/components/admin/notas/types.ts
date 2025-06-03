
export interface Nota {
  id: string;
  prova1: number;
  prova2: number;
  trabalho: number;
  media_final: number;
  trimestre: number;
  prova_professor: number;
  prova_final: number;
  ano_letivo: number;
  aluno_id: string;
  disciplina_id: string;
  aluno?: { nome: string; codigo: string };
  disciplina?: { nome: string; codigo: string };
}

export interface Aluno {
  id: string;
  nome: string;
  codigo: string;
}

export interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
}

export interface NotaFormData {
  aluno_id: string;
  disciplina_id: string;
  prova1: string;
  prova2: string;
  trabalho: string;
  trimestre: string;
  prova_professor: string;
  prova_final: string;
  ano_letivo: string;
}
