"use server"

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getChips() {
  const { data, error } = await supabase
    .from('chips')
    .select(`
      *,
      funcionarios (id, nome)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function addChip(formData: FormData) {
  const obj = {
    numero: formData.get('numero') as string,
    plano: formData.get('plano') as string,
    status: formData.get('status') as string || 'Ativo',
  };

  const { error } = await supabase.from('chips').insert([obj]);

  if (error) throw new Error(error.message);
  revalidatePath('/chips');
}

export async function vincularChipAoFuncionario(formData: FormData) {
  const chipId = formData.get('chip_id') as string;
  const funcionarioId = formData.get('funcionario_id') as string;
  const acao = formData.get('acao') as string; // 'vincular' ou 'desvincular'

  if (acao === 'desvincular') {
    const { error } = await supabase
      .from('chips')
      .update({ funcionario_id: null, status: 'Ativo' })
      .eq('id', chipId);
    if (error) throw new Error(error.message);
    
  } else {
    // Vincular novo (Sem restrição de quantidade para o Chip, diferente de celular/note)
    const { error } = await supabase
      .from('chips')
      .update({ funcionario_id: funcionarioId, status: 'Em Uso' })
      .eq('id', chipId);
      
    if (error) throw new Error(error.message);
  }

  revalidatePath('/chips');
  revalidatePath('/funcionarios');
}
