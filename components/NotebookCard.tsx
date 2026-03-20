"use client"

import { useState } from 'react';
import { Cpu, HardDrive, ShieldCheck, UserMinus, UserPlus, Edit2, Check, X, Wrench, Clock } from 'lucide-react';
import { editarNotebookInfo, vincularNotebookAoFuncionario, toggleManutencaoNotebook, toggleStatusNotebook } from '@/app/actions/notebooks';
import HistoryModal from '@/components/HistoryModal';

export default function NotebookCard({ note, funcionarios }: { note: any, funcionarios: any[] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [modeloMarca, setModeloMarca] = useState(note.modelo_marca);
    const [processador, setProcessador] = useState(note.processador);
    const [memoria, setMemoria] = useState(note.memoria);
    const [hd, setHd] = useState(note.hd);
    const [so, setSo] = useState(note.so);
    const [loading, setLoading] = useState(false);
    const [showManutencaoInput, setShowManutencaoInput] = useState(false);
    const [observacaoManutencao, setObservacaoManutencao] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    const handleSalvar = async () => {
        if (!modeloMarca.trim() || !processador.trim() || !memoria.trim() || !hd.trim() || !so.trim()) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            await editarNotebookInfo(note.id, modeloMarca, processador, memoria, hd, so);
            setIsEditing(false);
        } catch (e) {
            alert("Erro ao editar informações!");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        setIsEditing(false);
        setModeloMarca(note.modelo_marca);
        setProcessador(note.processador);
        setMemoria(note.memoria);
        setHd(note.hd);
        setSo(note.so);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-1">
                    {isEditing ? (
                        <div className="flex flex-col gap-2 w-full max-w-md">
                            <input
                                type="text"
                                value={modeloMarca}
                                onChange={e => setModeloMarca(e.target.value)}
                                className="p-1.5 border border-slate-300 rounded-md text-sm font-bold w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                                placeholder="Modelo/Marca"
                                autoFocus
                            />
                        </div>
                    ) : (
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            {note.modelo_marca}
                            <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-500 transition-colors" title="Editar Informações">
                                <Edit2 size={14} />
                            </button>
                        </h3>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                        ${note.status === 'Disponível' ? 'bg-emerald-100 text-emerald-700' :
                            note.status === 'Em Uso' ? 'bg-blue-100 text-blue-700' :
                            note.status === 'Em Manutenção' ? 'bg-orange-100 text-orange-700' :
                                'bg-slate-200 text-slate-700'}`}>
                        {note.status}
                    </span>
                </div>

                {isEditing ? (
                    <div className="space-y-3 mt-4 animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-slate-400 font-bold">Processador</label>
                                <input type="text" value={processador} onChange={e => setProcessador(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs text-black" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-slate-400 font-bold">Nº Serial (Não Editável)</label>
                                <input type="text" value={note.serial} disabled className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-slate-400 font-bold">Memória RAM</label>
                                <input type="text" value={memoria} onChange={e => setMemoria(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs text-black" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-slate-400 font-bold">Armaz.</label>
                                <input type="text" value={hd} onChange={e => setHd(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs text-black" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase text-slate-400 font-bold">Sist. Oper.</label>
                                <input type="text" value={so} onChange={e => setSo(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-xs text-black" />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button onClick={handleSalvar} disabled={loading} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-semibold flex items-center justify-center flex-1 transition-colors disabled:opacity-50">
                                <Check size={14} className="mr-1.5" /> Salvar Alterações
                            </button>
                            <button onClick={handleCancelar} className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg text-xs font-semibold flex items-center justify-center flex-1 transition-colors">
                                <X size={14} className="mr-1.5" /> Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3">
                            <span className="flex items-center gap-1"><Cpu size={14} className="text-slate-400" /> {note.processador}</span>
                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600">S/N: {note.serial}</span>
                        </div>
                        <div className="flex gap-4 text-xs font-medium text-slate-500 bg-slate-50 w-fit p-2 rounded-lg border border-slate-100">
                            <div className="flex flex-col"><span className="text-slate-400 text-[10px] uppercase tracking-wider">Memória</span><span className="text-slate-700">{note.memoria}</span></div>
                            <div className="w-px bg-slate-200"></div>
                            <div className="flex flex-col"><span className="text-slate-400 text-[10px] uppercase tracking-wider">Armaz.</span><span className="text-slate-700">{note.hd}</span></div>
                            <div className="w-px bg-slate-200"></div>
                            <div className="flex flex-col"><span className="text-slate-400 text-[10px] uppercase tracking-wider">S.O.</span><span className="text-slate-700">{note.so}</span></div>
                        </div>
                    </>
                )}
            </div>

            <div className="w-full md:w-64 shrink-0 bg-slate-50 rounded-lg p-3 border border-slate-100 h-full">
                {note.status === 'Em Uso' ? (
                    <div className="text-center space-y-2">
                        <div className="text-xs text-slate-500 mb-1">Vinculado a:</div>
                        <div className="font-medium text-sm text-slate-800 bg-white p-2 rounded-md border border-slate-200 shadow-sm truncate" title={note.funcionarios?.nome}>{note.funcionarios?.nome}</div>

                        <form action={vincularNotebookAoFuncionario}>
                            <input type="hidden" name="notebook_id" value={note.id} />
                            <input type="hidden" name="acao" value="desvincular" />
                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors font-medium">
                                <UserMinus size={14} /> Desvincular e Devolver
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <form action={vincularNotebookAoFuncionario} className="space-y-2">
                            <input type="hidden" name="notebook_id" value={note.id} />
                            <input type="hidden" name="acao" value="vincular" />
                            <select name="funcionario_id" required className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs text-black focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                <option value="">Selecionar Funcionário...</option>
                                {funcionarios?.filter(f => f.status === 'Ativo' && (!f.notebooks || f.notebooks.length === 0)).map(f => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                ))}
                            </select>
                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-md transition-colors font-medium">
                                <UserPlus size={14} /> Atribuir
                            </button>
                        </form>
                        <div className="pt-2 border-t border-slate-100">
                            {showManutencaoInput ? (
                                <form action={async (formData) => {
                                    const obs = formData.get('observacoes') as string;
                                    await toggleManutencaoNotebook(note.id, note.status, obs);
                                    setShowManutencaoInput(false);
                                    setObservacaoManutencao("");
                                }} className="space-y-2 mt-2">
                                    <input
                                        type="text"
                                        name="observacoes"
                                        required
                                        value={observacaoManutencao}
                                        onChange={e => setObservacaoManutencao(e.target.value)}
                                        placeholder="Motivo / Observações..."
                                        className="w-full p-2 border border-slate-300 rounded-md text-xs text-black focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-orange-600 text-white hover:bg-orange-700 px-3 py-1.5 rounded-md transition-colors font-medium">
                                            <Check size={14} /> Confirmar
                                        </button>
                                        <button type="button" onClick={() => setShowManutencaoInput(false)} className="w-full flex items-center justify-center gap-1.5 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors font-medium">
                                            <X size={14} /> Cancelar
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button type="button" onClick={() => setShowManutencaoInput(true)} className="w-full flex items-center justify-center gap-1.5 text-xs bg-white border border-slate-300 text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-md transition-colors font-medium mt-2">
                                    <Wrench size={14} /> {note.status === 'Em Manutenção' ? 'Retornar de Manutenção' : 'Enviar p/ Manutenção'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
                <button type="button" onClick={() => setShowHistory(true)} className="w-full flex items-center justify-center gap-1.5 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors font-medium mt-2 border border-slate-200">
                    <Clock size={14} /> Ver Histórico
                </button>

                <form action={async () => {
                    if (note.status !== 'Inativo' && !confirm("Tem certeza que deseja inativar este notebook? Se estiver em uso, ele será desvinculado do funcionário.")) return;
                    await toggleStatusNotebook(note.id, note.status);
                }}>
                    <button type="submit" className="w-full mt-2 text-[10px] text-slate-400 hover:text-slate-600 underline decoration-slate-200 underline-offset-2 py-1 transition-colors">
                        {note.status === 'Inativo' ? 'Reativar Notebook' : 'Inativar / Baixar Notebook'}
                    </button>
                </form>
            </div>

            <HistoryModal
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                equipamentoId={note.id}
                titulo={`Notebook ${note.modelo_marca} - S/N: ${note.serial}`}
            />
        </div>
    );
}
