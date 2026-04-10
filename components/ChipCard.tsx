"use client"

import { useState } from 'react';
import { SmartphoneNfc, UserMinus, UserPlus, Check, X, Clock, Edit2 } from 'lucide-react';
import { vincularChipAoFuncionario, toggleStatusChip, editarChipInfo } from '@/app/actions/chips';
import HistoryModal from '@/components/HistoryModal';

export default function ChipCard({ chip, funcionarios }: { chip: any, funcionarios: any[] }) {
    const [showHistory, setShowHistory] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [numero, setNumero] = useState(chip.numero);
    const [plano, setPlano] = useState(chip.plano);
    const [loading, setLoading] = useState(false);

    const handleSalvar = async () => {
        if (!numero.trim() || !plano.trim()) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            await editarChipInfo(chip.id, numero, plano);
            setIsEditing(false);
        } catch (e) {
            alert("Erro ao editar informações!");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        setIsEditing(false);
        setNumero(chip.numero);
        setPlano(chip.plano);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex-1 w-full flex items-center gap-4">
                <div className={`p-3 rounded-full flex shrink-0 ${chip.status === 'Disponível' ? 'bg-emerald-100' : chip.status === 'Em Uso' ? 'bg-pink-100' : 'bg-slate-100'}`}>
                    <SmartphoneNfc size={24} className={`${chip.status === 'Disponível' ? 'text-emerald-600' : chip.status === 'Em Uso' ? 'text-pink-600' : 'text-slate-400'}`} />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={numero}
                                onChange={e => setNumero(e.target.value)}
                                className="p-1.5 border border-slate-300 rounded-md text-lg font-bold font-mono tracking-tight w-full focus:ring-2 focus:ring-pink-500 focus:outline-none text-black"
                                placeholder="Número"
                                autoFocus
                            />
                        ) : (
                            <h3 className="text-lg font-bold text-slate-800 font-mono tracking-tight flex items-center gap-2">
                                {chip.numero}
                                <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-pink-500 transition-colors" title="Editar Informações">
                                    <Edit2 size={14} />
                                </button>
                            </h3>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                            ${(chip.status === 'Disponível' || chip.status === 'Ativo') ? 'bg-emerald-100 text-emerald-700' :
                                chip.status === 'Em Uso' ? 'bg-pink-100 text-pink-700' :
                                    'bg-slate-100 text-slate-600'}`}>
                            {chip.status === 'Ativo' ? 'Disponível' : chip.status}
                        </span>
                    </div>
                    {isEditing ? (
                        <div className="space-y-3 mt-2">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-slate-400 font-bold">Plano Contratado</label>
                                <input
                                    type="text"
                                    value={plano}
                                    onChange={e => setPlano(e.target.value)}
                                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-medium text-black"
                                    placeholder="Plano"
                                />
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleSalvar} disabled={loading} className="px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-md text-xs font-semibold flex items-center justify-center flex-1 transition-colors disabled:opacity-50">
                                    <Check size={14} className="mr-1" /> Salvar
                                </button>
                                <button onClick={handleCancelar} className="px-3 py-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-md text-xs font-semibold flex items-center justify-center flex-1 transition-colors">
                                    <X size={14} className="mr-1" /> Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm font-medium text-slate-600">Plano: <span className="text-slate-800">{chip.plano}</span></div>
                    )}
                </div>
            </div>

            <div className="w-full md:w-64 shrink-0 bg-slate-50 rounded-lg p-3 border border-slate-100">
                {chip.status === 'Em Uso' ? (
                    <div className="text-center space-y-2">
                        <div className="text-xs text-slate-500 mb-1">Em uso por:</div>
                        <div className="font-medium text-sm text-slate-800 bg-white p-2 rounded-md border border-slate-200 shadow-sm">{chip.funcionarios?.nome}</div>

                        <form action={vincularChipAoFuncionario} className="inline-block w-full">
                            <input type="hidden" name="chip_id" value={chip.id} />
                            <input type="hidden" name="acao" value="desvincular" />
                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors font-medium">
                                <UserMinus size={14} /> Desvincular e Devolver
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <form action={vincularChipAoFuncionario} className="space-y-2">
                            <input type="hidden" name="chip_id" value={chip.id} />
                            <input type="hidden" name="acao" value="vincular" />
                            <select name="funcionario_id" required className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs text-black focus:ring-2 focus:ring-pink-500 focus:outline-none">
                                <option value="">Atribuir Funcionario...</option>
                                {funcionarios?.filter(f => f.status === 'Ativo').map(f => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                ))}
                            </select>
                            <button type="submit" disabled={chip.status === 'Inativo'} className="w-full flex items-center justify-center gap-1.5 text-xs bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 px-3 py-1.5 rounded-md transition-colors font-medium disabled:opacity-50">
                                <UserPlus size={14} /> Atribuir
                            </button>
                        </form>

                        <form action={async () => {
                            await toggleStatusChip(chip.id, chip.status);
                        }}>
                            <button type="submit" className="w-full mt-2 text-xs text-slate-500 hover:text-slate-800 underline decoration-slate-300 underline-offset-2 py-1 transition-colors">
                                {chip.status === 'Disponível' ? 'Cancelar / Inativar Chip' : 'Reativar Chip'}
                            </button>
                        </form>
                    </div>
                )}

                <button type="button" onClick={() => setShowHistory(true)} className="w-full flex items-center justify-center gap-1.5 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors font-medium mt-2 border border-slate-200">
                    <Clock size={14} /> Ver Histórico
                </button>
            </div>

            <HistoryModal
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                equipamentoId={chip.id}
                titulo={`Chip ${chip.numero} - ${chip.plano}`}
            />
        </div>
    );
}
