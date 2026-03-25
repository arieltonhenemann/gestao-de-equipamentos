"use server"

import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function buscarGlobal(query: string) {
  if (!query || query.trim().length < 2) return { funcionarios: [], notebooks: [], celulares: [], chips: [] };
  
  const supabase = await createSupabaseServerClient();
  const termo = `%${query.trim()}%`;
  
  const [funcRes, noteRes, celRes, chipRes] = await Promise.all([
    supabase.from('funcionarios').select('id, nome, cpf, setor, status').or(`nome.ilike.${termo},cpf.ilike.${termo},setor.ilike.${termo}`).limit(5),
    supabase.from('notebooks').select('id, modelo_marca, serial, status').or(`modelo_marca.ilike.${termo},serial.ilike.${termo}`).limit(5),
    supabase.from('celulares').select('id, modelo_marca, serial, status').or(`modelo_marca.ilike.${termo},serial.ilike.${termo}`).limit(5),
    supabase.from('chips').select('id, numero, plano, status').or(`numero.ilike.${termo},plano.ilike.${termo}`).limit(5),
  ]);

  return {
    funcionarios: funcRes.data || [],
    notebooks: noteRes.data || [],
    celulares: celRes.data || [],
    chips: chipRes.data || []
  };
}
