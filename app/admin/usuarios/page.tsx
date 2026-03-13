import { getProfiles } from '@/app/actions/admin';
import { approveUser, rejectUser } from '@/app/actions/admin';
import { UserCheck, UserX, Clock, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminUsuariosPage() {
    const profiles = await getProfiles();

    const pendentes = profiles?.filter(p => !p.approved) || [];
    const aprovados = profiles?.filter(p => p.approved) || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3">
                <ShieldCheck size={28} className="text-purple-500" />
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Gerenciar Usuários</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Aprove ou rejeite solicitações de acesso ao sistema</p>
                </div>
            </div>

            {/* Pendentes */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock size={18} className="text-amber-500" />
                    <h2 className="text-lg font-semibold text-slate-800">Aguardando Aprovação</h2>
                    {pendentes.length > 0 && (
                        <span className="ml-auto bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full">
                            {pendentes.length}
                        </span>
                    )}
                </div>

                {pendentes.length === 0 ? (
                    <p className="text-slate-400 text-sm py-4 text-center">Nenhuma solicitação pendente.</p>
                ) : (
                    <div className="space-y-3">
                        {pendentes.map((profile) => (
                            <div key={profile.id} className="flex items-center justify-between p-4 bg-amber-50 border border-amber-100 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-800">{profile.email}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        Solicitado em {new Date(profile.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <form action={approveUser.bind(null, profile.id)}>
                                        <button type="submit" className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                                            <UserCheck size={15} /> Aprovar
                                        </button>
                                    </form>
                                    <form action={rejectUser.bind(null, profile.id)}>
                                        <button type="submit" className="flex items-center gap-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-sm font-medium px-3 py-2 rounded-lg transition-colors">
                                            <UserX size={15} /> Rejeitar
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Aprovados */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <UserCheck size={18} className="text-emerald-500" />
                    <h2 className="text-lg font-semibold text-slate-800">Usuários com Acesso</h2>
                    <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        {aprovados.length}
                    </span>
                </div>
                {aprovados.length === 0 ? (
                    <p className="text-slate-400 text-sm py-4 text-center">Nenhum usuário aprovado ainda.</p>
                ) : (
                    <div className="space-y-2">
                        {aprovados.map((profile) => (
                            <div key={profile.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-700 text-sm">{profile.email}</p>
                                    <p className="text-xs text-slate-400">
                                        Desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                                    Ativo
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
