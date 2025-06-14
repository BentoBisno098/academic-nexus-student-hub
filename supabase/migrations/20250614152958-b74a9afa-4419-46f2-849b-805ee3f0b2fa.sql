
-- Adicionar a coluna 'sala' na tabela horarios
ALTER TABLE public.horarios ADD COLUMN IF NOT EXISTS sala text;
