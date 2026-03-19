import { getChips, addChip, vincularChipAoFuncionario } from '@/app/actions/chips';
import { getFuncionarios } from '@/app/actions/funcionarios';
import { SmartphoneNfc, Columns, Filter } from 'lucide-react';
import ChipCard from '@/components/ChipCard';
import LocalSearch from '@/components/LocalSearch';

export default async function ChipsPage(props: { searchParams: Promise<{ filter?: string, q?: string }> }) {
    const searchParams = await props.searchParams;
    const chips = await getChips();
    const funcionarios = await getFuncionarios();

    const currentFilter = searchParams?.filter || 'Todos';
    const q = searchParams?.q?.toLowerCase() || '';

    const filteredChips = chips?.filter(c => {
        const matchesStatus = currentFilter === 'Todos' || c.status === currentFilter;
        const matchesQuery = q ? (
            c.numero?.toLowerCase().includes(q) ||
            c.plano?.toLowerCase().includes(q)
        ) : true;
        return matchesStatus && matchesQuery;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Chips de Telefone</h1>
                <LocalSearch placeholder="Buscar chip por número ou plano..." />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Formulário de Cadastro */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 xl:col-span-1 h-fit">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <SmartphoneNfc size={20} className="text-pink-500" />
                        <h2 className="text-lg font-semibold">Novo Chip</h2>
                    </div>

                    <form action={addChip} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nº do Telefone</label>
                            <input name="numero" type="text" required placeholder="Ex: (11) 99999-9999"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plano Contratado</label>
                            <input name="plano" type="text" required placeholder="Ex: TIM Black 50GB"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status Inicial</label>
                            <select name="status" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-black">
                                <option value="Ativo">Ativo (Pronto para Uso)</option>
                                <option value="Inativo">Inativo (Cancelado)</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full mt-4 bg-pink-600 hover:bg-pink-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                            Cadastrar Chip
                        </button>
                    </form>
                </div>

                {/* Listagem de Chips */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Filtros */}
                    <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-500 mr-2 whitespace-nowrap">Filtrar por Status:</span>
                        <div className="flex bg-slate-100 p-1 rounded-lg max-w-full overflow-x-auto">
                            <a
                                href="/chips?filter=Todos"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Todos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Todos
                            </a>
                            <a
                                href="/chips?filter=Ativo"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Ativo' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Ativos
                            </a>
                            <a
                                href="/chips?filter=Em Uso"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Em Uso' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Em Uso
                            </a>
                            <a
                                href="/chips?filter=Inativo"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Inativo' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Inativos
                            </a>
                        </div>
                    </div>

                    {filteredChips?.map((chip) => (
                        <ChipCard key={chip.id} chip={chip} funcionarios={funcionarios || []} />
                    ))}
                    {(!filteredChips || filteredChips.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
                            Nenhum chip encontrado com o filtro "{currentFilter}".
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
