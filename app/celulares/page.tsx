import { getCelulares, addCelular } from '@/app/actions/celulares';
import { getFuncionarios } from '@/app/actions/funcionarios';
import { Smartphone, Columns, Filter } from 'lucide-react';
import CelularCard from '@/components/CelularCard';
import LocalSearch from '@/components/LocalSearch';

export default async function CelularesPage(props: { searchParams: Promise<{ filter?: string, q?: string }> }) {
    const searchParams = await props.searchParams;
    const celulares = await getCelulares();
    const funcionarios = await getFuncionarios();

    const currentFilter = searchParams?.filter || 'Todos';
    const q = searchParams?.q?.toLowerCase() || '';

    const filteredCelulares = celulares?.filter(c => {
        const matchesStatus = currentFilter === 'Todos' || c.status === currentFilter;
        const matchesQuery = q ? (
            c.modelo_marca?.toLowerCase().includes(q) ||
            c.serial?.toLowerCase().includes(q) ||
            c.armazenamento?.toLowerCase().includes(q)
        ) : true;
        return matchesStatus && matchesQuery;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Celulares</h1>
                <LocalSearch placeholder="Buscar celular por modelo, serial ou IMEI..." />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Formulário de Cadastro */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 xl:col-span-1 h-fit">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <Smartphone size={20} className="text-purple-500" />
                        <h2 className="text-lg font-semibold">Novo Celular</h2>
                    </div>

                    <form action={addCelular} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Modelo / Marca</label>
                            <input name="modelo_marca" type="text" required placeholder="Ex: iPhone 13"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Processador</label>
                                <input name="processador" type="text" required placeholder="Ex: A15 Bionic"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Memória RAM</label>
                                <input name="memoria" type="text" required placeholder="Ex: 4GB"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Armazenamento</label>
                                <input name="armazenamento" type="text" required placeholder="Ex: 128GB"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tela</label>
                                <input name="tela" type="text" required placeholder="Ex: 6.1 OLED"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">IMEI / Número Serial</label>
                            <input name="serial" type="text" required placeholder="Ex: 990000862471854"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900" />
                        </div>

                        <button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                            Cadastrar Celular
                        </button>
                    </form>
                </div>

                {/* Listagem de Celulares */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Filtros */}
                    <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-500 mr-2 whitespace-nowrap">Filtrar por Status:</span>
                        <div className="flex bg-slate-100 p-1 rounded-lg max-w-full overflow-x-auto">
                            <a
                                href="/celulares?filter=Todos"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Todos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Todos
                            </a>
                            <a
                                href="/celulares?filter=Disponível"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Disponível' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Disponíveis
                            </a>
                            <a
                                href="/celulares?filter=Em Uso"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Em Uso' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Em Uso
                            </a>
                            <a
                                href="/celulares?filter=Em Manutenção"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Em Manutenção' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Manutenção
                            </a>
                        </div>
                    </div>

                    {filteredCelulares?.map((cel) => (
                        <CelularCard key={cel.id} cel={cel} funcionarios={funcionarios || []} />
                    ))}
                    {(!filteredCelulares || filteredCelulares.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
                            Nenhum celular encontrado no estoque com o filtro "{currentFilter}".
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
