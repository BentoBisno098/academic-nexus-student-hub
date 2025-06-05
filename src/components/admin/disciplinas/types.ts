
export interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
  professor: string;
}

export interface Horario {
  id: string;
  disciplina_id: string;
  dia: string;
  inicio: string;
  fim: string;
  sala?: string;
}

export const diasSemana = [
  'Segunda-feira',
  'Terça-feira', 
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado'
];
