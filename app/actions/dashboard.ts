import { supabase } from '@/lib/supabase';

export async function getDashboardStats() {
  const [funcCount, notebCount, celCount, chipCount] = await Promise.all([
    supabase.from('funcionarios').select('*', { count: 'exact', head: true }),
    supabase.from('notebooks').select('*', { count: 'exact', head: true }),
    supabase.from('celulares').select('*', { count: 'exact', head: true }),
    supabase.from('chips').select('*', { count: 'exact', head: true })
  ]);

  const [notebInUse, celInUse, chipInUse] = await Promise.all([
    supabase.from('notebooks').select('*', { count: 'exact', head: true }).eq('status', 'Em Uso'),
    supabase.from('celulares').select('*', { count: 'exact', head: true }).eq('status', 'Em Uso'),
    supabase.from('chips').select('*', { count: 'exact', head: true }).eq('status', 'Em Uso')
  ]);

  const [notebAvailable, celAvailable, chipAvailable] = await Promise.all([
    supabase.from('notebooks').select('*', { count: 'exact', head: true }).eq('status', 'Disponível'),
    supabase.from('celulares').select('*', { count: 'exact', head: true }).eq('status', 'Disponível'),
    supabase.from('chips').select('*', { count: 'exact', head: true }).eq('status', 'Ativo')
  ]);

  return {
    funcionarios: { total: funcCount.count || 0 },
    notebooks: { total: notebCount.count || 0, emUso: notebInUse.count || 0, disponivel: notebAvailable.count || 0 },
    celulares: { total: celCount.count || 0, emUso: celInUse.count || 0, disponivel: celAvailable.count || 0 },
    chips: { total: chipCount.count || 0, emUso: chipInUse.count || 0, disponivel: chipAvailable.count || 0 }
  };
}
