"use client"

import { useState } from 'react';
import { Smartphone, UserMinus, UserPlus, Clock } from 'lucide-react';
import { vincularCelularAoFuncionario } from '@/app/actions/celulares';
import CelularMaintenanceForm from '@/components/CelularMaintenanceForm';
import HistoryModal from '@/components/HistoryModal';

export default function CelularCard({ cel, funcionarios }: { cel: any, funcionarios: any[] }) {
    const [showHistory, setShowHistory] = useState(false);

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{cel.modelo_marca}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                        ${cel.status === 'Disponível' ? 'bg-emerald-100 text-emerald-700' :
                            cel.status === 'Em Uso' ? 'bg-blue-100 text-blue-700' :
                                'bg-orange-100 text-orange-700'}`}>
                        {cel.status}
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Smartphone size={14} className="text-slate-400" /> {cel.processador}</span>
                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600">IMEI/Serial: {cel.serial}</span>
                    {cel.email_supervisionado && (
                        <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-xs">📧 Supervisonado: {cel.email_supervisionado}</span>
                    )}
                    {cel.email_supervisor && (
                        <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-xs">👤 Supervisor: {cel.email_supervisor}</span>
                    )}
                </div>
                <div className="flex gap-4 text-xs font-medium text-slate-500 bg-slate-50 w-fit p-2 rounded-lg border border-slate-100">
                    <div className="flex flex-col"><span className="text-slate-400 text-[10px] uppercase tracking-wider">Memória</span><span className="text-slate-700">{cel.memoria}</span></div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="flex flex-col"><span className="text-slate-400 text-[10px] uppercase tracking-wider">Armaz.</span><span className="text-slate-700">{cel.armazenamento}</span></div>
                    <div className="w-px bg-slate-200"></div>
                    <div className="flex flex-col"><span className="text-slate-400 text-[10px] uppercase tracking-wider">Tela</span><span className="text-slate-700">{cel.tela}</span></div>
                </div>
            </div>

            <div className="w-full md:w-64 shrink-0 bg-slate-50 rounded-lg p-3 border border-slate-100">
                {cel.status === 'Em Uso' ? (
                    <div className="text-center space-y-2">
                        <div className="text-xs text-slate-500 mb-1">Vinculado a:</div>
                        <div className="font-medium text-sm text-slate-800 bg-white p-2 rounded-md border border-slate-200 shadow-sm">{cel.funcionarios?.nome}</div>

                        <form action={vincularCelularAoFuncionario}>
                            <input type="hidden" name="celular_id" value={cel.id} />
                            <input type="hidden" name="acao" value="desvincular" />
                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors font-medium">
                                <UserMinus size={14} /> Desvincular e Devolver
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <form action={vincularCelularAoFuncionario} className="space-y-2">
                            <input type="hidden" name="celular_id" value={cel.id} />
                            <input type="hidden" name="acao" value="vincular" />
                            <select name="funcionario_id" required className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none">
                                <option value="">Selecionar Funcionário...</option>
                                {funcionarios?.filter(f => f.status === 'Ativo' && (!f.celulares || f.celulares.length === 0)).map(f => (
                                    <option key={f.id} value={f.id}>{f.nome}</option>
                                ))}
                            </select>
                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-md transition-colors font-medium">
                                <UserPlus size={14} /> Atribuir
                            </button>
                        </form>
                        <div className="pt-2 border-t border-slate-100">
                            <CelularMaintenanceForm cel={cel} />
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
                equipamentoId={cel.id}
                titulo={`Celular ${cel.modelo_marca} - IMEI: ${cel.serial}`}
            />
        </div>
    );
}
