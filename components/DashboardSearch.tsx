"use client"

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Users, Laptop, Smartphone, SmartphoneNfc, X } from 'lucide-react';
import { buscarGlobal } from '@/app/actions/search';
import Link from 'next/link';

export default function DashboardSearch() {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<any>({ funcionarios: [], notebooks: [], celulares: [], chips: [] });
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Fecha o dropdown quando clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Busca debounced
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                const data = await buscarGlobal(query);
                setResults(data);
                setIsLoading(false);
                setIsOpen(true);
            } else {
                setIsOpen(false);
            }
        }, 400); // 400ms debounce
        return () => clearTimeout(timer);
    }, [query]);

    const hasResults = results.funcionarios.length > 0 || results.notebooks.length > 0 || results.celulares.length > 0 || results.chips.length > 0;

    return (
        <div className="relative w-full max-w-xl" ref={wrapperRef}>
            <div className="relative flex items-center">
                <Search className="absolute left-3 text-slate-400" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (query.length >= 2) setIsOpen(true) }}
                    placeholder="Pesquisar funcionário, notebook, celular ou chip..."
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 text-blue-500 animate-spin" size={18} />
                )}
                {!isLoading && query.length > 0 && (
                    <button onClick={() => { setQuery(''); setIsOpen(false); }} className="absolute right-3 text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 max-h-[70vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                    {!hasResults && !isLoading ? (
                        <div className="p-4 text-center text-sm text-slate-500">Nenhum resultado encontrado para "{query}".</div>
                    ) : (
                        <div className="py-2">
                            {results.funcionarios.length > 0 && (
                                <div className="px-4 py-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Users size={12} /> Funcionários</h4>
                                    <div className="space-y-1">
                                        {results.funcionarios.map((f: any) => (
                                            <Link href="/funcionarios" key={f.id} onClick={() => setIsOpen(false)} className="block p-2 hover:bg-slate-50 rounded-lg group">
                                                <div className="text-sm font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{f.nome}</div>
                                                <div className="text-xs text-slate-500">{f.cpf} • {f.setor}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.notebooks.length > 0 && (
                                <div className="px-4 py-2 border-t border-slate-50">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Laptop size={12} /> Notebooks</h4>
                                    <div className="space-y-1">
                                        {results.notebooks.map((n: any) => (
                                            <Link href="/notebooks" key={n.id} onClick={() => setIsOpen(false)} className="block p-2 hover:bg-slate-50 rounded-lg group">
                                                <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{n.modelo_marca}</div>
                                                <div className="text-xs text-slate-500">SN: {n.serial} • <span className={n.status === 'Em Uso' ? 'text-amber-600' : 'text-emerald-600'}>{n.status}</span></div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.celulares.length > 0 && (
                                <div className="px-4 py-2 border-t border-slate-50">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Smartphone size={12} /> Celulares</h4>
                                    <div className="space-y-1">
                                        {results.celulares.map((c: any) => (
                                            <Link href="/celulares" key={c.id} onClick={() => setIsOpen(false)} className="block p-2 hover:bg-slate-50 rounded-lg group">
                                                <div className="text-sm font-medium text-slate-800 group-hover:text-purple-600 transition-colors">{c.modelo_marca}</div>
                                                <div className="text-xs text-slate-500">IMEI/SN: {c.serial} • <span className={c.status === 'Em Uso' ? 'text-amber-600' : 'text-emerald-600'}>{c.status}</span></div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.chips.length > 0 && (
                                <div className="px-4 py-2 border-t border-slate-50">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><SmartphoneNfc size={12} /> Chips</h4>
                                    <div className="space-y-1">
                                        {results.chips.map((ch: any) => (
                                            <Link href="/chips" key={ch.id} onClick={() => setIsOpen(false)} className="block p-2 hover:bg-slate-50 rounded-lg group">
                                                <div className="text-sm font-medium text-slate-800 group-hover:text-pink-600 transition-colors">{ch.numero}</div>
                                                <div className="text-xs text-slate-500">{ch.plano} • <span className={ch.status === 'Em Uso' ? 'text-amber-600' : 'text-emerald-600'}>{ch.status}</span></div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
