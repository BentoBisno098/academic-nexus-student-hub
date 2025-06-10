
-- Adicionar coluna período na tabela alunos
ALTER TABLE public.alunos 
ADD COLUMN periodo text CHECK (periodo IN ('Manhã', 'Tarde'));

-- Definir um valor padrão para registros existentes
UPDATE public.alunos 
SET periodo = 'Manhã' 
WHERE periodo IS NULL;
