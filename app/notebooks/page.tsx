import { getNotebooks, addNotebook } from '@/app/actions/notebooks';
import { getFuncionarios } from '@/app/actions/funcionarios';
import { Laptop, Filter } from 'lucide-react';
import NotebookCard from '@/components/NotebookCard';
import LocalSearch from '@/components/LocalSearch';

export default async function NotebooksPage(props: { searchParams: Promise<{ filter?: string, q?: string }> }) {
    const searchParams = await props.searchParams;
    const notebooks = await getNotebooks();
    const funcionarios = await getFuncionarios(); // Para o select de vincular

    const currentFilter = searchParams?.filter || 'Todos';
    const q = searchParams?.q?.toLowerCase() || '';

    const filteredNotebooks = notebooks?.filter(n => {
        const matchesStatus = currentFilter === 'Todos' ? n.status !== 'Inativo' : n.status === currentFilter;
        const matchesQuery = q ? (
            n.modelo_marca?.toLowerCase().includes(q) ||
            n.serial?.toLowerCase().includes(q) ||
            n.processador?.toLowerCase().includes(q)
        ) : true;
        return matchesStatus && matchesQuery;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-800">Notebooks</h1>
                <LocalSearch placeholder="Buscar notebook por modelo, serial..." />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* Formulário de Cadastro */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 xl:col-span-1 h-fit">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <Laptop size={20} className="text-indigo-500" />
                        <h2 className="text-lg font-semibold">Novo Notebook</h2>
                    </div>

                    <form action={addNotebook} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Modelo / Marca</label>
                            <input name="modelo_marca" type="text" required placeholder="Ex: Dell Inspiron 15"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-black" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Processador</label>
                                <input name="processador" type="text" required placeholder="Ex: i5 11ª Ger"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Memória RAM</label>
                                <input name="memoria" type="text" required placeholder="Ex: 16GB"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-black" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Armazenamento</label>
                                <input name="hd" type="text" required placeholder="Ex: 512GB SSD"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sistema Oper.</label>
                                <input name="so" type="text" required placeholder="Ex: Windows 11"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-black" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nº Serial / Service Tag</label>
                            <input name="serial" type="text" required placeholder="Ex: ABC123XP"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-black" />
                        </div>

                        <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                            Cadastrar Notebook
                        </button>
                    </form>
                </div>

                {/* Listagem de Notebooks */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Filtros */}
                    <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-500 mr-2 whitespace-nowrap">Filtrar por Status:</span>
                        <div className="flex bg-slate-100 p-1 rounded-lg max-w-full overflow-x-auto">
                            <a
                                href="/notebooks?filter=Todos"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Todos' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Todos
                            </a>
                            <a
                                href="/notebooks?filter=Disponível"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Disponível' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Disponíveis
                            </a>
                            <a
                                href="/notebooks?filter=Em Uso"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Em Uso' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Em Uso
                            </a>
                            <a
                                href="/notebooks?filter=Em Manutenção"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Em Manutenção' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Manutenção
                            </a>
                            <a
                                href="/notebooks?filter=Inativo"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === 'Inativo' ? 'bg-white text-slate-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Inativos
                            </a>
                        </div>
                    </div>

                    {filteredNotebooks?.map((note) => (
                        <NotebookCard key={note.id} note={note} funcionarios={funcionarios} />
                    ))}
                    {(!filteredNotebooks || filteredNotebooks.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
                            Nenhum notebook encontrado no estoque com o filtro "{currentFilter}".
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
