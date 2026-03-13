-- Script de migração: Sistema de Aprovação de Usuários
-- Execute este script no SQL Editor do Supabase

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: service_role tem acesso total (usado nas server actions)
CREATE POLICY "Service role full access" ON profiles
  USING (true)
  WITH CHECK (true);
