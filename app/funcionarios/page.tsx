import { getFuncionarios, addFuncionario } from '@/app/actions/funcionarios';
import { UserPlus, Filter } from 'lucide-react';
import FuncionarioCard from '@/components/FuncionarioCard';
import Link from 'next/link';

export default async function FuncionariosPage(props: { searchParams: Promise<{ filter?: string }> }) {
    const searchParams = await props.searchParams;
    const funcionarios = await getFuncionarios();
    const currentFilter = searchParams?.filter || 'Ativo';

    // Filtra no servidor antes de renderizar (Ativos por default)
    const filteredFuncionarios = funcionarios?.filter(f => f.status === currentFilter);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-slate-800">Funcionários</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Formulário de Cadastro */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1 h-fit">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <UserPlus size={20} className="text-blue-500" />
                        <h2 className="text-lg font-semibold">Novo Cadastro</h2>
                    </div>

                    <form action={addFuncionario} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                            <input name="nome" type="text" required
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                            <input name="cpf" type="text" required
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Setor</label>
                            <input name="setor" type="text" required
                                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900" />
                        </div>
                        <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                            Cadastrar Funcionário
                        </button>
                    </form>
                </div>

                {/* Lista de Funcionários */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Filtros */}
                    <div className="flex items-center gap-2 mb-2">
                        <Filter size={16} className="text-slate-400" />
                        <span className="text-sm font-medium text-slate-500 mr-2">Filtrar por Status:</span>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <a
                                href="/funcionarios?filter=Ativo"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${currentFilter === 'Ativo' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Ativos
                            </a>
                            <a
                                href="/funcionarios?filter=Inativo"
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${currentFilter === 'Inativo' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Inativos
                            </a>
                        </div>
                    </div>

                    {filteredFuncionarios?.map((func) => (
                        <FuncionarioCard key={func.id} func={func} />
                    ))}
                    {(!filteredFuncionarios || filteredFuncionarios.length === 0) && (
                        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-500">
                            Nenhum funcionário encontrado com o filtro "{currentFilter}".
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
