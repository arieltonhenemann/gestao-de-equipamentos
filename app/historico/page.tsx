import { getAllHistorico } from '@/app/actions/historico';
import { Activity, CheckCircle, AlertTriangle, Clock, Server } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const dynamic = 'force-dynamic';

export default async function HistoricoGeralPage() {
    const logs = await getAllHistorico();

    const getIcon = (acao: string) => {
        if (acao.includes('Cadastro') || acao.includes('Vínculo')) return <CheckCircle size={16} className="text-emerald-500" />;
        if (acao.includes('Manutenção')) return <AlertTriangle size={16} className="text-orange-500" />;
        return <Activity size={16} className="text-blue-500" />;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800">Histórico de Atividades</h1>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[500px]">
                {(!logs || logs.length === 0) ? (
                    <div className="flex flex-col items-center justify-center p-20 text-slate-500 border border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <Server size={48} className="text-slate-300 mb-4" />
                        <p className="text-lg font-medium text-slate-600 mb-1">Nenhum evento registrado no sistema.</p>
                        <p className="text-sm">As movimentações de equipamentos aparecerão aqui.</p>
                    </div>
                ) : (
                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-4 pt-2">
                        {logs.map((log: any) => (
                            <div key={log.id} className="relative pl-6">
                                <div className="absolute -left-[9px] top-1 bg-white rounded-full p-0.5 border border-slate-200 shadow-sm">
                                    {getIcon(log.acao)}
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-slate-800">{log.acao}</span>
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                                {log.equipamento_tipo}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded">
                                            <Clock size={12} />
                                            {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                        {log.descricao}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
