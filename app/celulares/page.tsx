import { getCelulares, addCelular } from '@/app/actions/celulares';
import { getFuncionarios } from '@/app/actions/funcionarios';
import { Smartphone, Columns, Filter } from 'lucide-react';
import CelularCard from '@/components/CelularCard';
import LocalSearch from '@/components/LocalSearch';
import EmailFilter from '@/components/EmailFilter';

export default async function CelularesPage(props: { searchParams: Promise<{ filter?: string, q?: string, email?: string }> }) {
    const searchParams = await props.searchParams;
    const celulares = await getCelulares();
    const funcionarios = await getFuncionarios();

    const currentFilter = searchParams?.filter || 'Todos';
    const currentEmail = searchParams?.email || 'Todos';
    const q = searchParams?.q?.toLowerCase() || '';

    // Extrair emails únicos para o filtro
    const uniqueEmails = Array.from(new Set(celulares?.map(c => c.email_supervisionado).filter(Boolean))) as string[];

    const filteredCelulares = celulares?.filter(c => {
        const matchesStatus = currentFilter === 'Todos' ? c.status !== 'Inativo' : c.status === currentFilter;
        const matchesQuery = q ? (
            c.modelo_marca?.toLowerCase().includes(q) ||
            c.serial?.toLowerCase().includes(q) ||
            c.armazenamento?.toLowerCase().includes(q)
        ) : true;

        const matchesEmail = currentEmail === 'Todos' ? true :
                             currentEmail === 'somente_com_email' ? !!c.email_supervisionado :
                             c.email_supervisionado === currentEmail;

        return matchesStatus && matchesQuery && matchesEmail;
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
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-black" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Processador</label>
                                <input name="processador" type="text" required placeholder="Ex: A15 Bionic"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Memória RAM</label>
                                <input name="memoria" type="text" required placeholder="Ex: 4GB"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-black" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Armazenamento</label>
                                <input name="armazenamento" type="text" required placeholder="Ex: 128GB"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-black" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tela</label>
                                <input name="tela" type="text" required placeholder="Ex: 6.1 OLED"
                                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-black" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">IMEI / Número Serial</label>
                            <input name="serial" type="text" required placeholder="Ex: 990000862471854"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email supervisionado</label>
                            <input name="email_supervisionado" type="email" placeholder="Ex: usuario@empresa.com"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-black" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email supervisor</label>
                            <input name="email_supervisor" type="email" placeholder="Ex: supervisor@empresa.com"
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-black" />
                        </div>

                        <button type="submit" className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                            Cadastrar Celular
                        </button>
                    </form>
                </div>

                {/* Listagem de Celulares */}
                <div className="xl:col-span-2 space-y-4">
                    {/* Filtros */}
                    <div className="flex flex-wrap items-center gap-4 mb-2 overflow-x-auto pb-1">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-slate-400" />
                            <span className="text-sm font-medium text-slate-500 mr-2 whitespace-nowrap">Filtrar por Status:</span>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {['Todos', 'Disponível', 'Em Uso', 'Em Manutenção', 'Inativo'].map((status) => {
                                    const params = new URLSearchParams();
                                    if (status !== 'Todos') params.set('filter', status);
                                    if (currentEmail !== 'Todos') params.set('email', currentEmail);
                                    if (q) params.set('q', q);
                                    const href = `/celulares?${params.toString()}`;
                                    
                                    const label = status === 'Todos' ? 'Todos' : 
                                                 status === 'Disponível' ? 'Disponíveis' :
                                                 status === 'Em Uso' ? 'Em Uso' :
                                                 status === 'Em Manutenção' ? 'Manutenção' : 'Inativos';
                                                 
                                    const activeColors = status === 'Todos' ? 'text-slate-800' :
                                                        status === 'Disponível' ? 'text-emerald-600' :
                                                        status === 'Em Uso' ? 'text-purple-600' :
                                                        status === 'Em Manutenção' ? 'text-orange-600' : 'text-slate-400';

                                    return (
                                        <a
                                            key={status}
                                            href={href}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${currentFilter === status ? `bg-white ${activeColors} shadow-sm` : 'text-slate-500 hover:text-slate-700'}`}
                                        >
                                            {label}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        <EmailFilter emails={uniqueEmails} currentEmail={currentEmail} />
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
