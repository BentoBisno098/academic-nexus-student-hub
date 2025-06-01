
export interface Horario {
  id: string;
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplina_id: string;
  disciplinas?: { nome: string; codigo: string };
}

export interface Disciplina {
  id: string;
  nome: string;
  codigo: string;
}

export interface HorarioFormData {
  dia: string;
  inicio: string;
  fim: string;
  turma: string;
  disciplina_id: string;
}
