-- Histórico de Equipamentos
-- IMPORTANTE: Execute este script no SQL Editor do seu Supabase para criar a tabela de histórico.

CREATE TABLE historico_equipamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  equipamento_id UUID NOT NULL, -- ID do notebook, celular ou chip
  equipamento_tipo TEXT NOT NULL, -- 'notebook', 'celular' ou 'chip'
  acao TEXT NOT NULL, -- Ex: 'Cadastro', 'Manutenção', 'Vínculo'
  descricao TEXT NOT NULL, -- Registro de alterações e observações manuais
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
