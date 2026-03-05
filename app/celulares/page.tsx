import { getCelulares, addCelular, vincularCelularAoFuncionario } from '@/app/actions/celulares';
import { getFuncionarios } from '@/app/actions/funcionarios';
import { Smartphone, Cpu, HardDrive, Columns, UserMinus, UserPlus, Filter } from 'lucide-react';

export default async function CelularesPage(props: { searchParams: Promise<{ filter?: string }> }) {
    const searchParams = await props.searchParams;
    const celulares = await getCelulares();
    const funcionarios = await getFuncionarios();

    const currentFilter = searchParams?.filter || 'Todos';
    const filteredCelulares = currentFilter === 'Todos' ? celulares : celulares?.filter(c => c.status === currentFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800">Celulares</h1>
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
                        </div>
                    </div>

                    {filteredCelulares?.map((cel) => (
                        <div key={cel.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                            {/* Esquerda: Info Básica */}
                            <div className="md:col-span-5">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-slate-800">{cel.modelo_marca}</h3>
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                    ${cel.status === 'Disponível' ? 'bg-emerald-100 text-emerald-700' :
                                            cel.status === 'Em Uso' ? 'bg-purple-100 text-purple-700' :
                                                'bg-orange-100 text-orange-700'}`}>
                                        {cel.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                                    <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs text-slate-600">IMEI: {cel.serial}</span>
                                </div>
                            </div>

                            {/* Centro: Specs */}
                            <div className="md:col-span-3 text-sm text-slate-600 space-y-1">
                                <div className="flex items-center gap-1.5"><Cpu size={14} className="text-slate-400" /> {cel.processador}</div>
                                <div className="flex items-center gap-1.5"><HardDrive size={14} className="text-slate-400" /> {cel.memoria} RAM • {cel.armazenamento}</div>
                                <div className="flex items-center gap-1.5"><Columns size={14} className="text-slate-400" /> {cel.tela}</div>
                            </div>

                            {/* Direita: Ações de Vínculo */}
                            <div className="md:col-span-4 flex flex-col justify-center bg-slate-50 p-3 rounded-lg border border-slate-100 h-full">
                                {cel.status === 'Em Uso' ? (
                                    <div className="text-sm">
                                        <p className="text-slate-500 text-xs mb-1">Em posse de:</p>
                                        <p className="font-semibold text-slate-800 mb-2 truncate" title={cel.funcionarios?.nome}>{cel.funcionarios?.nome}</p>
                                        <form action={vincularCelularAoFuncionario}>
                                            <input type="hidden" name="celular_id" value={cel.id} />
                                            <input type="hidden" name="acao" value="desvincular" />
                                            <button type="submit" className="w-full flex items-center justify-center gap-1.5 text-xs bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-md transition-colors">
                                                <UserMinus size={14} /> Desvincular
                                            </button>
                                        </form>
                                    </div>
                                ) : (
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
                                )}
                            </div>

                        </div>
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
