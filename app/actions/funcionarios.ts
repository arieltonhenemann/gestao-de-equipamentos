"use server"

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getFuncionarios() {
  const { data, error } = await supabase
    .from('funcionarios')
    .select(`
      *,
      notebooks (id, modelo_marca, serial),
      celulares (id, modelo_marca, serial),
      chips (id, numero, plano)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function addFuncionario(formData: FormData) {
  const nome = formData.get('nome') as string;
  const cpf = formData.get('cpf') as string;
  const setor = formData.get('setor') as string;

  const { error } = await supabase.from('funcionarios').insert([
    { nome, cpf, setor }
  ]);

  if (error) throw new Error(error.message);
  revalidatePath('/funcionarios');
}

export async function inativarFuncionario(id: string) {
  // 1. Inativar o funcionário
  const { error: funcError } = await supabase
    .from('funcionarios')
    .update({ status: 'Inativo' })
    .eq('id', id);

  if (funcError) throw new Error(funcError.message);

  // 2. Desvincular e disponibilizar Equipamentos/Chips
  // Notebooks
  await supabase
    .from('notebooks')
    .update({ funcionario_id: null, status: 'Disponível' })
    .eq('funcionario_id', id);

  // Celulares
  await supabase
    .from('celulares')
    .update({ funcionario_id: null, status: 'Disponível' })
    .eq('funcionario_id', id);

  // Chips
  await supabase
    .from('chips')
    .update({ funcionario_id: null, status: 'Ativo' })
    .eq('funcionario_id', id);

  revalidatePath('/funcionarios');
}

export async function reativarFuncionario(id: string) {
  const { error } = await supabase
    .from('funcionarios')
    .update({ status: 'Ativo' })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/funcionarios');
}

export async function editarFuncionarioInfo(id: string, novoNome: string, novoSetor: string) {
  const { error } = await supabase
    .from('funcionarios')
    .update({ nome: novoNome, setor: novoSetor })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/funcionarios');
}
