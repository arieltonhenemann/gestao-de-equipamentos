-- Habilitar UUID-ossp extension para IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Funcionários
CREATE TABLE funcionarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  setor TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo', -- 'Ativo' ou 'Inativo'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notebooks
CREATE TABLE notebooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modelo_marca TEXT NOT NULL,
  processador TEXT NOT NULL,
  memoria TEXT NOT NULL,
  hd TEXT NOT NULL,
  so TEXT NOT NULL,
  serial TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Disponível', -- 'Disponível', 'Em Uso', 'Manutenção'
  funcionario_id UUID REFERENCES funcionarios(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Celulares
CREATE TABLE celulares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modelo_marca TEXT NOT NULL,
  processador TEXT NOT NULL,
  memoria TEXT NOT NULL,
  armazenamento TEXT NOT NULL,
  tela TEXT NOT NULL,
  serial TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Disponível', -- 'Disponível', 'Em Uso', 'Manutenção'
  funcionario_id UUID REFERENCES funcionarios(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chips
CREATE TABLE chips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero TEXT UNIQUE NOT NULL,
  plano TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo', -- 'Ativo', 'Em Uso', 'Inativo'
  funcionario_id UUID REFERENCES funcionarios(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
