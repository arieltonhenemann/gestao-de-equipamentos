import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, Laptop, Smartphone, SmartphoneNfc, History, LogOut, ShieldCheck } from 'lucide-react';
import { logout } from '@/app/actions/auth';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export default async function Sidebar() {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const isAdmin = user?.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

    const menuItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Funcionários', href: '/funcionarios', icon: Users },
        { name: 'Notebooks', href: '/notebooks', icon: Laptop },
        { name: 'Celulares', href: '/celulares', icon: Smartphone },
        { name: 'Chips', href: '/chips', icon: SmartphoneNfc },
        { name: 'Histórico', href: '/historico', icon: History },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white h-screen sticky top-0 flex flex-col p-4 print:hidden overflow-y-auto">
            <div className="mb-6 flex items-center justify-center">
                <div className="relative w-full h-24 hidden md:block">
                    <Image
                        src="/Logo-vorx.png"
                        alt="Logo VORX COMPANY"
                        fill
                        sizes="(max-width: 768px) 0px, 256px"
                        className="object-contain"
                    />
                </div>
            </div>
            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-blue-400"
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}

                {/* Menu exclusivo do admin */}
                {isAdmin && (
                    <>
                        <div className="pt-2 pb-1">
                            <p className="text-[10px] uppercase tracking-widest text-slate-500 px-4 font-semibold">Administração</p>
                        </div>
                        <Link
                            href="/admin/usuarios"
                            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-purple-400 text-purple-400"
                        >
                            <ShieldCheck size={20} />
                            <span className="font-medium">Usuários</span>
                        </Link>
                    </>
                )}
            </nav>
            <div className="mt-auto border-t border-slate-700 pt-4 space-y-3">
                <p className="text-xs text-slate-400 text-center">v0.1 - Painel de Controle</p>
                <form action={logout}>
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={16} />
                        Sair
                    </button>
                </form>
            </div>
        </div>
    );
}
