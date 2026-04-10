"use client"

import { useState } from 'react';
import { UserMinus, UserPlus, Laptop, Smartphone, SmartphoneNfc, ShieldAlert, RotateCcw, Edit2, Check, X, Printer } from 'lucide-react';
import { inativarFuncionario, reativarFuncionario, editarFuncionarioInfo } from '@/app/actions/funcionarios';
import TermoModal from './TermoModal';
import Link from 'next/link';

interface Funcionario {
    id: string;
    nome: string;
    cpf: string;
    setor: string;
    status: string;
    notebooks?: any[];
    celulares?: any[];
    chips?: any[];
}

export default function FuncionarioCard({ func }: { func: Funcionario }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [nomeEditado, setNomeEditado] = useState(func.nome);
    const [setorEditado, setSetorEditado] = useState(func.setor);
    const [loading, setLoading] = useState(false);
    const [isTermoModalOpen, setIsTermoModalOpen] = useState(false);

    const handleSalvar = async () => {
        if (!nomeEditado.trim() || !setorEditado.trim() || (nomeEditado === func.nome && setorEditado === func.setor)) {
            setIsEditing(false);
            return;
        }

        setLoading(true);
        try {
            await editarFuncionarioInfo(func.id, nomeEditado, setorEditado);
            setIsEditing(false);
        } catch (e) {
            alert("Erro ao editar informações!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    {isEditing ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <input
                                type="text"
                                value={nomeEditado}
                                onChange={(e) => setNomeEditado(e.target.value)}
                                className="p-1 border border-slate-300 rounded text-black text-sm font-bold w-full sm:w-[200px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Nome"
                                autoFocus
                            />
                            <input
                                type="text"
                                value={setorEditado}
                                onChange={(e) => setSetorEditado(e.target.value)}
                                className="p-1 border border-slate-300 rounded text-black text-sm w-full sm:w-[150px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                placeholder="Setor"
                            />
                            <div className="flex gap-1">
                                <button onClick={handleSalvar} disabled={loading} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Salvar">
                                    <Check size={18} />
                                </button>
                                <button onClick={() => { setIsEditing(false); setNomeEditado(func.nome); setSetorEditado(func.setor); }} className="p-1.5 text-slate-400 hover:bg-slate-50 rounded" title="Cancelar">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h3
                                className="text-lg font-bold text-slate-800 flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
                                onClick={() => setIsExpanded(!isExpanded)}
                                title="Ver detalhes dos equipamentos"
                            >
                                {func.nome}
                                <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="text-slate-400 hover:text-blue-500 transition-colors ml-1" title="Editar Informações">
                                    <Edit2 size={14} />
                                </button>
                            </h3>
                        </>
                    )}

                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${func.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {func.status}
                    </span>
                </div>

                {isEditing ? (
                    <p className="text-sm text-slate-500 mb-3">CPF: {func.cpf}</p>
                ) : (
                    <p className="text-sm text-slate-500 mb-3">CPF: {func.cpf} • Setor: {func.setor}</p>
                )}

                {/* Equipamentos */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {func.notebooks && func.notebooks.length > 0 && (
                        <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium border border-indigo-100">
                            <Laptop size={14} /> {func.notebooks.length} Notebook(s)
                        </span>
                    )}
                    {func.celulares && func.celulares.length > 0 && (
                        <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2.5 py-1 rounded-md text-xs font-medium border border-purple-100">
                            <Smartphone size={14} /> {func.celulares.length} Celular(es)
                        </span>
                    )}
                    {func.chips && func.chips.length > 0 && (
                        <span className="flex items-center gap-1.5 bg-pink-50 text-pink-700 px-2.5 py-1 rounded-md text-xs font-medium border border-pink-100">
                            <SmartphoneNfc size={14} /> {func.chips.length} Chip(s)
                        </span>
                    )}
                    {(!func.notebooks?.length && !func.celulares?.length && !func.chips?.length) && (
                        <span className="text-xs text-slate-400 italic">Nenhum equipamento vinculado</span>
                    )}
                </div>

                {/* Detalhes Expandidos */}
                {isExpanded && ((func.notebooks?.length ?? 0) > 0 || (func.celulares?.length ?? 0) > 0 || (func.chips?.length ?? 0) > 0) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {func.notebooks?.map((note: any) => (
                            <Link key={note.id} href={`/notebooks?q=${encodeURIComponent(note.serial)}`} className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col gap-1 hover:bg-indigo-50 hover:border-indigo-200 transition-all group cursor-pointer">
                                <span className="font-semibold text-slate-700 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Laptop size={14} className="text-indigo-500" /> Notebook</span>
                                    <span className="text-[10px] text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase">Ver Detalhes →</span>
                                </span>
                                <span className="text-slate-600 font-normal">Modelo/Marca: <span className="text-black font-medium">{note.modelo_marca}</span></span>
                                <span className="text-slate-600 font-normal">Serial: <span className="text-black font-medium">{note.serial}</span></span>
                            </Link>
                        ))}
                        {func.celulares?.map((cel: any) => (
                            <Link key={cel.id} href={`/celulares?q=${encodeURIComponent(cel.serial)}`} className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col gap-1 hover:bg-purple-50 hover:border-purple-200 transition-all group cursor-pointer">
                                <span className="font-semibold text-slate-700 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><Smartphone size={14} className="text-purple-500" /> Celular</span>
                                    <span className="text-[10px] text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase">Ver Detalhes →</span>
                                </span>
                                <span className="text-slate-600 font-normal">Modelo/Marca: <span className="text-black font-medium">{cel.modelo_marca}</span></span>
                                <span className="text-slate-600 font-normal">Serial: <span className="text-black font-medium">{cel.serial}</span></span>
                            </Link>
                        ))}
                        {func.chips?.map((chip: any) => (
                            <Link key={chip.id} href={`/chips?q=${encodeURIComponent(chip.numero)}`} className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col gap-1 hover:bg-pink-50 hover:border-pink-200 transition-all group cursor-pointer">
                                <span className="font-semibold text-slate-700 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><SmartphoneNfc size={14} className="text-pink-500" /> Chip</span>
                                    <span className="text-[10px] text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold uppercase">Ver Detalhes →</span>
                                </span>
                                <span className="text-slate-600 font-normal">Número: <span className="text-black font-medium">{chip.numero}</span></span>
                                <span className="text-slate-600 font-normal">Plano: <span className="text-black font-medium">{chip.plano}</span></span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Ações Laterais */}
            <div className="flex flex-col sm:flex-row items-end sm:items-start justify-end gap-2">
                <button 
                    onClick={() => setIsTermoModalOpen(true)}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                    title="Gerar termo de responsabilidade"
                >
                    <Printer size={16} />
                    Gerar Termo
                </button>

                {func.status === 'Ativo' ? (
                    <form action={async () => {
                        await inativarFuncionario(func.id);
                    }}>
                        <button type="submit" className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100">
                            <ShieldAlert size={16} />
                            Inativar
                        </button>
                    </form>
                ) : (
                    <form action={async () => {
                        await reativarFuncionario(func.id);
                    }}>
                        <button type="submit" className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-emerald-100">
                            <RotateCcw size={16} />
                            Reativar
                        </button>
                    </form>
                )}
            </div>

            {/* Modal do Termo */}
            <div className={isTermoModalOpen ? 'print:visible' : ''}>
                <TermoModal 
                    func={func}
                    isOpen={isTermoModalOpen}
                    onClose={() => setIsTermoModalOpen(false)}
                />
            </div>
        </div>
    );
}
