"use server"

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { registrarHistorico } from './historico';

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

  const { data, error } = await supabase.from('chips').insert([obj]).select();

  if (error) throw new Error(error.message);

  if (data && data[0]) {
      await registrarHistorico(
          data[0].id, 
          'chip', 
          'Cadastro', 
          `Chip cadastrado no sistema (Número: ${obj.numero} - ${obj.plano})`
      );
  }

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
    
    await registrarHistorico(chipId, 'chip', 'Desvinculação', 'Chip devolvido / desvinculado do funcionário');

  } else {
    // Buscar nome do funcionario para o historico
    const { data: funcData } = await supabase.from('funcionarios').select('nome').eq('id', funcionarioId).single();

    // Vincular novo (Sem restrição de quantidade para o Chip, diferente de celular/note)
    const { error } = await supabase
      .from('chips')
      .update({ funcionario_id: funcionarioId, status: 'Em Uso' })
      .eq('id', chipId);
      
    if (error) throw new Error(error.message);

    await registrarHistorico(chipId, 'chip', 'Vínculo', `Atribuído ao funcionário: ${funcData?.nome || funcionarioId}`);
  }

  revalidatePath('/chips');
  revalidatePath('/funcionarios');
}

export async function toggleStatusChip(chipId: string, currentStatus: string) {
  const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
  
  const { error } = await supabase
    .from('chips')
    .update({ status: newStatus })
    .eq('id', chipId);

  if (error) throw new Error(error.message);

  const acao = newStatus === 'Inativo' ? 'Chip Inativado' : 'Chip Reativado';
  await registrarHistorico(chipId, 'chip', acao, `Status alterado manualmente para ${newStatus}`);

  revalidatePath('/chips');
}
