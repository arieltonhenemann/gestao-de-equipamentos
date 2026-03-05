"use server"

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getNotebooks() {
  const { data, error } = await supabase
    .from('notebooks')
    .select(`
      *,
      funcionarios (id, nome)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function addNotebook(formData: FormData) {
  const obj = {
    modelo_marca: formData.get('modelo_marca') as string,
    processador: formData.get('processador') as string,
    memoria: formData.get('memoria') as string,
    hd: formData.get('hd') as string,
    so: formData.get('so') as string,
    serial: formData.get('serial') as string,
  };

  const { error } = await supabase.from('notebooks').insert([obj]);

  if (error) throw new Error(error.message);
  revalidatePath('/notebooks');
}

export async function vincularNotebookAoFuncionario(formData: FormData) {
  const notebookId = formData.get('notebook_id') as string;
  const funcionarioId = formData.get('funcionario_id') as string;
  const acao = formData.get('acao') as string; // 'vincular' ou 'desvincular'

  if (acao === 'desvincular') {
    const { error } = await supabase
      .from('notebooks')
      .update({ funcionario_id: null, status: 'Disponível' })
      .eq('id', notebookId);
    if (error) throw new Error(error.message);
    
  } else {
    // Verificar se funcionário já tem notebook
    const { data: funcNotebooks } = await supabase
      .from('notebooks')
      .select('id')
      .eq('funcionario_id', funcionarioId);

    if (funcNotebooks && funcNotebooks.length > 0) {
      throw new Error("Este funcionário já possui um Notebook vinculado.");
    }

    // Vincular novo
    const { error } = await supabase
      .from('notebooks')
      .update({ funcionario_id: funcionarioId, status: 'Em Uso' })
      .eq('id', notebookId);
      
    if (error) throw new Error(error.message);
  }

  revalidatePath('/notebooks');
  revalidatePath('/funcionarios');
}
