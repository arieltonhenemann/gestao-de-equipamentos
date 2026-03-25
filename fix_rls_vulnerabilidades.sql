-- Script para corrigir a vulnerabilidade de Segurança "RLS Disabled in Public"
-- Execute este script no SQL Editor do seu Dashboard do Supabase.

-- 1. Habilitar o RLS (Row Level Security) em todas as tabelas vulneráveis
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.celulares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_equipamentos ENABLE ROW LEVEL SECURITY;

-- 2. Criar políticas para permitir acesso a APENAS usuários autenticados
-- Dessa forma, o acesso público pela API ficará bloqueado, mas a sua aplicação, 
-- que usa a autenticação do Supabase, continuará funcionando normalmente.

-- Política para Funcionários
CREATE POLICY "Acesso completo para usuários autenticados" ON public.funcionarios
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Política para Notebooks
CREATE POLICY "Acesso completo para usuários autenticados" ON public.notebooks
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Política para Celulares
CREATE POLICY "Acesso completo para usuários autenticados" ON public.celulares
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Política para Chips
CREATE POLICY "Acesso completo para usuários autenticados" ON public.chips
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Política para Histórico de Equipamentos
CREATE POLICY "Acesso completo para usuários autenticados" ON public.historico_equipamentos
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
