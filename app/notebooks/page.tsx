import { getNotebooks, addNotebook, vincularNotebookAoFuncionario } from '@/app/actions/notebooks';
import { getFuncionarios } from '@/app/actions/funcionarios';
import { Laptop, Cpu, HardDrive, ShieldCheck, UserMinus, UserPlus, Filter } from 'lucide-react';

export default async function NotebooksPage(props: { searchParams: Promise<{ filter?: string }> }) {
    const searchParams = await props.searchParams;
    const notebooks = await getNotebooks();
    const funcionarios = await getFuncionarios(); // Para o select de vincular

    const currentFilter = searchParams?.filter || 'Todos';
    const filteredNotebooks = currentFilter === 'Todos' ? notebooks : notebooks?.filter(n => n.status === currentFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800">Notebooks</h1>
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
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Processador</label>
                                <input name="processador" type="text" required placeholder="Ex: i5 11ª Ger"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Memória RAM</label>
                                <input name="memoria" type="text" required placeholder="Ex: 16GB"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Armazenamento</label>
                                <input name="hd" type="text" required placeholder="Ex: 512GB SSD"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sistema Oper.</label>
                                <input name="so" type="text" required placeholder="Ex: Windows 11"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nº Serial / Service Tag</label>
                            <input name="serial" type="text" required placeholder="Ex: ABC123XP"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-slate-900" />
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
                        </div>
                    </div>

                    {filteredNotebooks?.map((note) => (
                        <div key={note.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                            {/* Esquerda: Info Básica */}
                            <div className="md:col-span-5">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-slate-800">{note.modelo_marca}</h3>
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
                            <div className="md:col-span-3 text-sm text-slate-600 space-y-1">
                                <div className="flex items-center gap-1.5"><Cpu size={14} className="text-slate-400" /> {note.processador}</div>
                                <div className="flex items-center gap-1.5"><HardDrive size={14} className="text-slate-400" /> {note.memoria} RAM • {note.hd}</div>
                                <div className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-slate-400" /> {note.so}</div>
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
                                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors">
                                                <UserMinus size={14} /> Desvincular
                                            </button>
                                        </form>
                                    </div>
                                ) : (
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
                                )}
                            </div>

                        </div>
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
