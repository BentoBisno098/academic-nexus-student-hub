
-- Criar tabela de períodos
CREATE TABLE public.periodos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir períodos padrão
INSERT INTO public.periodos (nome, descricao) VALUES 
('Manhã', 'Período matutino'),
('Tarde', 'Período vespertino'),
('Noite', 'Período noturno');

-- Adicionar coluna periodo_id na tabela alunos para fazer a ligação
ALTER TABLE public.alunos ADD COLUMN IF NOT EXISTS periodo_id UUID REFERENCES public.periodos(id);

-- Migrar dados existentes (converter texto para referência)
UPDATE public.alunos 
SET periodo_id = (
  SELECT id FROM public.periodos 
  WHERE nome = alunos.periodo
)
WHERE periodo IS NOT NULL;
