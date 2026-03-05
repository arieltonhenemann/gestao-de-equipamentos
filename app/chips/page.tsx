import { getChips, addChip, vincularChipAoFuncionario } from '@/app/actions/chips';
import { getFuncionarios } from '@/app/actions/funcionarios';
import { SmartphoneNfc, Phone, Wifi, UserMinus, UserPlus, Filter } from 'lucide-react';

export default async function ChipsPage(props: { searchParams: Promise<{ filter?: string }> }) {
    const searchParams = await props.searchParams;
    const chips = await getChips();
    const funcionarios = await getFuncionarios();

    const currentFilter = searchParams?.filter || 'Todos';
    const filteredChips = currentFilter === 'Todos' ? chips : chips?.filter(c => c.status === currentFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800">Chips de Telefone</h1>
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
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Plano Contratado</label>
                            <input name="plano" type="text" required placeholder="Ex: TIM Black 50GB"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status Inicial</label>
                            <select name="status" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-slate-900">
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
                        <div key={chip.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                            {/* Esquerda: Info Básica */}
                            <div className="md:col-span-5">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-slate-800">{chip.numero}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                    ${chip.status === 'Ativo' ? 'bg-emerald-100 text-emerald-700' :
                                            chip.status === 'Em Uso' ? 'bg-pink-100 text-pink-700' :
                                                'bg-red-100 text-red-700'}`}>
                                        {chip.status}
                                    </span>
                                </div>
                            </div>

                            {/* Centro: Specs */}
                            <div className="md:col-span-3 text-sm text-slate-600 space-y-1">
                                <div className="flex items-center gap-1.5"><Phone size={14} className="text-slate-400" /> Linha Móvel</div>
                                <div className="flex items-center gap-1.5"><Wifi size={14} className="text-slate-400" /> {chip.plano}</div>
                            </div>

                            {/* Direita: Ações de Vínculo */}
                            <div className="md:col-span-4 flex flex-col justify-center bg-slate-50 p-3 rounded-lg border border-slate-100 h-full">
                                {chip.status === 'Em Uso' ? (
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs mb-1">Em posse de:</p>
                                        <p className="font-semibold text-slate-800 mb-2 truncate" title={chip.funcionarios?.nome}>{chip.funcionarios?.nome}</p>
                                        <form action={vincularChipAoFuncionario}>
                                            <input type="hidden" name="chip_id" value={chip.id} />
                                            <input type="hidden" name="acao" value="desvincular" />
                                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors">
                                                <UserMinus size={14} /> Desvincular do Funcionário
                                            </button>
                                        </form>
                                    </div>
                                ) : chip.status === 'Ativo' ? (
                                    <form action={vincularChipAoFuncionario} className="space-y-2">
                                        <input type="hidden" name="chip_id" value={chip.id} />
                                        <input type="hidden" name="acao" value="vincular" />
                                        <select name="funcionario_id" required className="w-full p-2 bg-white border border-slate-300 rounded-md text-xs text-slate-900 focus:ring-2 focus:ring-pink-500 focus:outline-none">
                                            <option value="">Vincular a quem?</option>
                                            {funcionarios?.filter(f => f.status === 'Ativo' && (!f.chips || f.chips.length === 0)).map(f => (
                                                <option key={f.id} value={f.id}>{f.nome}</option>
                                            ))}
                                        </select>
                                        <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-pink-50 border border-pink-200 text-pink-700 hover:bg-pink-100 px-3 py-1.5 rounded-md transition-colors font-medium">
                                            <UserPlus size={14} /> Atribuir Chip
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-xs text-center text-slate-400 font-medium italic">
                                        Linha Cancelada.
                                    </div>
                                )}
                            </div>

                        </div>
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
