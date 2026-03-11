"use client"

import { useState, useEffect } from 'react';
import { getHistorico } from '@/app/actions/historico';
import { X, Clock, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';

interface HistoryModalProps {
    equipamentoId: string;
    isOpen: boolean;
    onClose: () => void;
    titulo: string;
}

export default function HistoryModal({ equipamentoId, isOpen, onClose, titulo }: HistoryModalProps) {
    const [historico, setHistorico] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !equipamentoId) return;

        let mounted = true;
        setLoading(true);

        const fetchHistorico = async () => {
            try {
                const data = await getHistorico(equipamentoId);
                if (mounted) {
                    setHistorico(data || []);
                }
            } catch (err) {
                console.error("Erro ao buscar histórico:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchHistorico();

        return () => {
            mounted = false;
        };
    }, [isOpen, equipamentoId]);

    if (!isOpen) return null;

    const getIcon = (acao: string) => {
        if (acao.includes('Cadastro') || acao.includes('Vínculo')) return <CheckCircle size={16} className="text-emerald-500" />;
        if (acao.includes('Manutenção')) return <AlertTriangle size={16} className="text-orange-500" />;
        return <Activity size={16} className="text-blue-500" />;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Histórico</h2>
                        <p className="text-xs text-slate-500">{titulo}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto flex-1 bg-slate-50/50">
                    {loading ? (
                        <div className="flex justify-center items-center py-10 opacity-50">
                            <Clock size={24} className="animate-spin text-slate-400" />
                        </div>
                    ) : historico.length === 0 ? (
                        <div className="text-center py-10 text-slate-500 text-sm">
                            <Clock size={32} className="mx-auto mb-2 text-slate-300" />
                            Nenhum registro encontrado para este equipamento.
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-4">
                            {historico.map((log, index) => (
                                <div key={log.id} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-1 bg-white rounded-full p-0.5 border border-slate-200 shadow-sm">
                                        {getIcon(log.acao)}
                                    </div>
                                    <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex flex-col gap-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="font-semibold text-sm text-slate-800">{log.acao}</span>
                                            <div className="text-xs text-slate-400 mt-2">
                                                {formatInTimeZone(new Date(log.created_at), 'America/Sao_Paulo', "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                            {log.descricao}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
