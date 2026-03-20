"use server"

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { registrarHistorico } from './historico';

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

  const { data, error } = await supabase.from('notebooks').insert([obj]).select();

  if (error) throw new Error(error.message);
  
  if (data && data[0]) {
      await registrarHistorico(
          data[0].id, 
          'notebook', 
          'Cadastro', 
          `Notebook cadastrado no sistema (${obj.modelo_marca} S/N: ${obj.serial})`
      );
  }

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
    
    await registrarHistorico(notebookId, 'notebook', 'Desvinculação', 'Equipamento devolvido / desvinculado do funcionário');
    
  } else {
    // Verificar se funcionário já tem notebook
    const { data: funcNotebooks } = await supabase
      .from('notebooks')
      .select('id')
      .eq('funcionario_id', funcionarioId);

    if (funcNotebooks && funcNotebooks.length > 0) {
      throw new Error("Este funcionário já possui um Notebook vinculado.");
    }

    // Buscar nome do funcionario para o historico
    const { data: funcData } = await supabase.from('funcionarios').select('nome').eq('id', funcionarioId).single();

    // Vincular novo
    const { error } = await supabase
      .from('notebooks')
      .update({ funcionario_id: funcionarioId, status: 'Em Uso' })
      .eq('id', notebookId);
      
    if (error) throw new Error(error.message);

    await registrarHistorico(notebookId, 'notebook', 'Vínculo', `Atribuído ao funcionário: ${funcData?.nome || funcionarioId}`);
  }

  revalidatePath('/notebooks');
  revalidatePath('/funcionarios');
}

export async function editarNotebookInfo(id: string, modelo_marca: string, processador: string, memoria: string, hd: string, so: string) {
  const { error } = await supabase
    .from('notebooks')
    .update({ modelo_marca, processador, memoria, hd, so })
    .eq('id', id);

  if (error) throw new Error(error.message);

  await registrarHistorico(id, 'notebook', 'Upgrade/Edição de Hardware', `Informações atualizadas: ${modelo_marca}, ${processador}, ${memoria} RAM, ${hd}, ${so}`);

  revalidatePath('/notebooks');
}

export async function toggleManutencaoNotebook(notebookId: string, currentStatus: string, observacoes: string = "") {
  const newStatus = currentStatus === 'Em Manutenção' ? 'Disponível' : 'Em Manutenção';
  
  const { error } = await supabase
    .from('notebooks')
    .update({ status: newStatus })
    .eq('id', notebookId);

  if (error) throw new Error(error.message);

  const acao = newStatus === 'Em Manutenção' ? 'Enviado para Manutenção' : 'Retornou da Manutenção';
  await registrarHistorico(notebookId, 'notebook', acao, observacoes || 'Sem observações detalhadas.');

  revalidatePath('/notebooks');
}

export async function toggleStatusNotebook(id: string, currentStatus: string) {
  const newStatus = currentStatus === 'Inativo' ? 'Disponível' : 'Inativo';
  
  const updateData: any = { status: newStatus };
  
  if (newStatus === 'Inativo') {
    updateData.funcionario_id = null;
  }

  const { error } = await supabase
    .from('notebooks')
    .update(updateData)
    .eq('id', id);

  if (error) throw new Error(error.message);

  const acao = newStatus === 'Inativo' ? 'Notebook Inativado' : 'Notebook Reativado';
  await registrarHistorico(id, 'notebook', acao, `Status alterado manualmente para ${newStatus}`);

  revalidatePath('/notebooks');
  revalidatePath('/funcionarios');
}
