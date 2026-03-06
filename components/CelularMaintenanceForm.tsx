"use client"

import { useState } from 'react';
import { toggleManutencaoCelular } from '@/app/actions/celulares';
import { Wrench, Check, X } from 'lucide-react';

export default function CelularMaintenanceForm({ cel }: { cel: any }) {
    const [showInput, setShowInput] = useState(false);
    const [observacao, setObservacao] = useState("");

    const handleSubmit = async (formData: FormData) => {
        const obs = formData.get('observacoes') as string;
        await toggleManutencaoCelular(cel.id, cel.status, obs);
        setShowInput(false);
        setObservacao("");
    };

    if (showInput) {
        return (
            <form action={handleSubmit} className="space-y-2 mt-2">
                <input
                    type="text"
                    name="observacoes"
                    required
                    value={observacao}
                    onChange={e => setObservacao(e.target.value)}
                    placeholder="Motivo / Observações..."
                    className="w-full p-2 border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    autoFocus
                />
                <div className="flex gap-2">
                    <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-orange-600 text-white hover:bg-orange-700 px-3 py-1.5 rounded-md transition-colors font-medium">
                        <Check size={14} /> Confirmar
                    </button>
                    <button type="button" onClick={() => setShowInput(false)} className="w-full flex items-center justify-center gap-1.5 text-xs bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors font-medium">
                        <X size={14} /> Cancelar
                    </button>
                </div>
            </form>
        );
    }

    return (
        <button type="button" onClick={() => setShowInput(true)} className="w-full flex items-center justify-center gap-1.5 text-xs bg-white border border-slate-300 text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-md transition-colors font-medium mt-2">
            <Wrench size={14} /> {cel.status === 'Em Manutenção' ? 'Retornar de Manutenção' : 'Enviar p/ Manutenção'}
        </button>
    );
}
