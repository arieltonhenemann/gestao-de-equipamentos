"use client"

import { useState } from 'react';
import { Cpu, HardDrive, ShieldCheck, UserMinus, UserPlus, Edit2, Check, X, Wrench, Clock } from 'lucide-react';
import { editarNotebookInfo, vincularNotebookAoFuncionario, toggleManutencaoNotebook } from '@/app/actions/notebooks';
import HistoryModal from '@/components/HistoryModal';

export default function NotebookCard({ note, funcionarios }: { note: any, funcionarios: any[] }) {
    const [isEditing, setIsEditing] = useState(false);
    const [processador, setProcessador] = useState(note.processador);
    const [memoria, setMemoria] = useState(note.memoria);
    const [hd, setHd] = useState(note.hd);
    const [so, setSo] = useState(note.so);
    const [loading, setLoading] = useState(false);
    const [showManutencaoInput, setShowManutencaoInput] = useState(false);
    const [observacaoManutencao, setObservacaoManutencao] = useState("");
    const [showHistory, setShowHistory] = useState(false);

    const handleSalvar = async () => {
        if (!processador.trim() || !memoria.trim() || !hd.trim() || !so.trim()) {
            setIsEditing(false);
            return;
        }

        if (processador === note.processador && memoria === note.memoria && hd === note.hd && so === note.so) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            await editarNotebookInfo(note.id, processador, memoria, hd, so);
            setIsEditing(false);
        } catch (e) {
            alert("Erro ao editar informações!");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = () => {
        setIsEditing(false);
        setProcessador(note.processador);
        setMemoria(note.memoria);
        setHd(note.hd);
        setSo(note.so);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center hover:shadow-md transition-shadow">
            {/* Esquerda: Info Básica */}
            <div className="md:col-span-5">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {note.modelo_marca}
                        {!isEditing && (
                            <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-500 transition-colors ml-1" title="Editar Hardware">
                                <Edit2 size={14} />
                            </button>
                        )}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                        ${note.status === 'Disponível' ? 'bg-emerald-100 text-emerald-700' :
                            note.status === 'Em Uso' ? 'bg-blue-100 text-blue-700' :
                                'bg-orange-100 text-orange-700'}`}>
                        {note.status}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600">S/N: {note.serial}</span>
                </div>
            </div>

            {/* Centro: Specs */}
            <div className="md:col-span-3 text-sm text-slate-600 space-y-2">
                {isEditing ? (
                    <div className="flex flex-col gap-2 animate-in fade-in duration-200">
                        <div className="flex items-center gap-2">
                            <Cpu size={14} className="text-slate-400 shrink-0" />
                            <input type="text" value={processador} onChange={e => setProcessador(e.target.value)} className="p-1.5 border border-slate-300 rounded-md text-xs w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Processador" autoFocus />
                        </div>
                        <div className="flex items-center gap-2">
                            <HardDrive size={14} className="text-slate-400 shrink-0" />
                            <input type="text" value={memoria} onChange={e => setMemoria(e.target.value)} className="p-1.5 border border-slate-300 rounded-md text-xs w-1/2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Memória RAM" />
                            <input type="text" value={hd} onChange={e => setHd(e.target.value)} className="p-1.5 border border-slate-300 rounded-md text-xs w-1/2 focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Armazenamento" />
                        </div>
                        <div className="flex items-center gap-2">
                            <ShieldCheck size={14} className="text-slate-400 shrink-0" />
                            <input type="text" value={so} onChange={e => setSo(e.target.value)} className="p-1.5 border border-slate-300 rounded-md text-xs w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="Sistema Operacional" />
                        </div>
                        <div className="flex gap-2 mt-1">
                            <button onClick={handleSalvar} disabled={loading} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md text-xs font-semibold flex items-center justify-center flex-1 transition-colors disabled:opacity-50" title="Salvar Alterações">
                                <Check size={14} className="mr-1" /> Salvar
                            </button>
                            <button onClick={handleCancelar} className="p-1.5 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-md text-xs font-semibold flex items-center justify-center flex-1 transition-colors" title="Cancelar">
                                <X size={14} className="mr-1" /> Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5"><Cpu size={14} className="text-slate-400" /> {note.processador}</div>
                        <div className="flex items-center gap-1.5"><HardDrive size={14} className="text-slate-400" /> {note.memoria} RAM • {note.hd}</div>
                        <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-slate-400" /> {note.so}</div>
                    </div>
                )}
            </div>

            {/* Direita: Ações de Vínculo */}
            <div className="md:col-span-4 flex flex-col justify-center bg-slate-50 p-3 rounded-lg border border-slate-100 h-full">
                {note.status === 'Em Uso' ? (
                    <div className="text-sm">
                        <p className="text-slate-500 text-xs mb-1">Em posse de:</p>
                        <p className="font-semibold text-slate-800 mb-2 truncate" title={note.funcionarios?.nome}>{note.funcionarios?.nome}</p>
                        <form action={vincularNotebookAoFuncionario}>
                            <input type="hidden" name="notebook_id" value={note.id} />
                            <input type="hidden" name="acao" value="desvincular" />
                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors font-medium">
                                <UserMinus size={14} /> Desvincular
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <form action={vincularNotebookAoFuncionario} className="space-y-2">
                            <input type="hidden" name="notebook_id" value={note.id} />
                            <input type="hidden" name="acao" value="vincular" />
                            <select name="funcionario_id" required className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
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
                                        className="w-full p-2 border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
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
