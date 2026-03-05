"use server"

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

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

  const { error } = await supabase.from('celulares').insert([obj]);

  if (error) throw new Error(error.message);
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
    
  } else {
    // Verificar se funcionário já tem celular
    const { data: funcCelulares } = await supabase
      .from('celulares')
      .select('id')
      .eq('funcionario_id', funcionarioId);

    if (funcCelulares && funcCelulares.length > 0) {
      throw new Error("Este funcionário já possui um Celular vinculado.");
    }

    // Vincular novo
    const { error } = await supabase
      .from('celulares')
      .update({ funcionario_id: funcionarioId, status: 'Em Uso' })
      .eq('id', celularId);
      
    if (error) throw new Error(error.message);
  }

  revalidatePath('/celulares');
  revalidatePath('/funcionarios');
}
