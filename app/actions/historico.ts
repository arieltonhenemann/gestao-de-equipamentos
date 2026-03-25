"use server"

import { createSupabaseServerClient } from '@/lib/supabase-server';

type TipoEquipamento = 'notebook' | 'celular' | 'chip' | 'funcionario';

export async function registrarHistorico(
    equipamento_id: string,
    equipamento_tipo: TipoEquipamento,
    acao: string,
    descricao: string
) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('historico_equipamentos').insert([{
        equipamento_id,
        equipamento_tipo,
        acao,
        descricao
    }]);

    if (error) {
        console.error("Erro ao registrar histórico:", error.message);
        // Não jogamos excessão para não quebrar o fluxo principal caso o histórico falhe
    }
}

export async function getHistorico(equipamento_id: string) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('historico_equipamentos')
        .select('*')
        .eq('equipamento_id', equipamento_id)
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function getAllHistorico() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('historico_equipamentos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}
