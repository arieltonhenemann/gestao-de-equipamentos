"use server"

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { registrarHistorico } from './historico';

export async function getFuncionarios() {
  const { data, error } = await supabase
    .from('funcionarios')
    .select(`
      *,
      notebooks (id, modelo_marca, serial, processador, memoria, hd, so),
      celulares (id, modelo_marca, serial, armazenamento, memoria, tela, processador),
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

  const { data, error } = await supabase.from('funcionarios').insert([
    { nome, cpf, setor }
  ]).select();

  if (error) throw new Error(error.message);

  if (data && data[0]) {
      await registrarHistorico(
          data[0].id,
          'funcionario',
          'Cadastro',
          `Funcionário cadastrado no sistema (Nome: ${nome}, Setor: ${setor})`
      );
  }
  revalidatePath('/funcionarios');
}

export async function inativarFuncionario(id: string) {
  // 1. Inativar o funcionário
  const { error: funcError } = await supabase
    .from('funcionarios')
    .update({ status: 'Inativo' })
    .eq('id', id);

  if (funcError) throw new Error(funcError.message);

  await registrarHistorico(id, 'funcionario', 'Inativação', 'Funcionário inativado no sistema.');

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

  await registrarHistorico(id, 'funcionario', 'Reativação', 'Funcionário reativado no sistema.');

  revalidatePath('/funcionarios');
}

export async function editarFuncionarioInfo(id: string, novoNome: string, novoSetor: string) {
  const { error } = await supabase
    .from('funcionarios')
    .update({ nome: novoNome, setor: novoSetor })
    .eq('id', id);

  if (error) throw new Error(error.message);

  await registrarHistorico(id, 'funcionario', 'Edição de Dados', `Dados do funcionário alterados para (Nome: ${novoNome}, Setor: ${novoSetor})`);

  revalidatePath('/funcionarios');
}
