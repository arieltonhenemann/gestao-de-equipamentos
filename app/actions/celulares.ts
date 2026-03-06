"use server"

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { registrarHistorico } from './historico';

export async function getCelulares() {
  const { data, error } = await supabase
    .from('celulares')
    .select(`
      *,
      funcionarios (id, nome)
    `)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function addCelular(formData: FormData) {
  const obj = {
    modelo_marca: formData.get('modelo_marca') as string,
    processador: formData.get('processador') as string,
    memoria: formData.get('memoria') as string,
    armazenamento: formData.get('armazenamento') as string,
    tela: formData.get('tela') as string,
    serial: formData.get('serial') as string,
  };

  const { data, error } = await supabase.from('celulares').insert([obj]).select();

  if (error) throw new Error(error.message);

  if (data && data[0]) {
      await registrarHistorico(
          data[0].id, 
          'celular', 
          'Cadastro', 
          `Celular cadastrado no sistema (${obj.modelo_marca} IMEI: ${obj.serial})`
      );
  }

  revalidatePath('/celulares');
}

export async function vincularCelularAoFuncionario(formData: FormData) {
  const celularId = formData.get('celular_id') as string;
  const funcionarioId = formData.get('funcionario_id') as string;
  const acao = formData.get('acao') as string; // 'vincular' ou 'desvincular'

  if (acao === 'desvincular') {
    const { error } = await supabase
      .from('celulares')
      .update({ funcionario_id: null, status: 'Disponível' })
      .eq('id', celularId);
    if (error) throw new Error(error.message);
    
    await registrarHistorico(celularId, 'celular', 'Desvinculação', 'Equipamento devolvido / desvinculado do funcionário');

  } else {
    // Verificar se funcionário já tem celular
    const { data: funcCelulares } = await supabase
      .from('celulares')
      .select('id')
      .eq('funcionario_id', funcionarioId);

    if (funcCelulares && funcCelulares.length > 0) {
      throw new Error("Este funcionário já possui um Celular vinculado.");
    }

    // Buscar nome do funcionario para o historico
    const { data: funcData } = await supabase.from('funcionarios').select('nome').eq('id', funcionarioId).single();

    // Vincular novo
    const { error } = await supabase
      .from('celulares')
      .update({ funcionario_id: funcionarioId, status: 'Em Uso' })
      .eq('id', celularId);
      
    if (error) throw new Error(error.message);

    await registrarHistorico(celularId, 'celular', 'Vínculo', `Atribuído ao funcionário: ${funcData?.nome || funcionarioId}`);
  }

  revalidatePath('/celulares');
  revalidatePath('/funcionarios');
}

export async function toggleManutencaoCelular(celularId: string, currentStatus: string, observacoes: string = "") {
  const newStatus = currentStatus === 'Em Manutenção' ? 'Disponível' : 'Em Manutenção';
  
  const { error } = await supabase
    .from('celulares')
    .update({ status: newStatus })
    .eq('id', celularId);

  if (error) throw new Error(error.message);

  const acao = newStatus === 'Em Manutenção' ? 'Enviado para Manutenção' : 'Retornou da Manutenção';
  await registrarHistorico(celularId, 'celular', acao, observacoes || 'Sem observações detalhadas.');

  revalidatePath('/celulares');
}
