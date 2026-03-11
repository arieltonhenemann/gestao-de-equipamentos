import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Users, Laptop, Smartphone, SmartphoneNfc, History } from 'lucide-react';

export default function Sidebar() {
    const menuItems = [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Funcionários', href: '/funcionarios', icon: Users },
        { name: 'Notebooks', href: '/notebooks', icon: Laptop },
        { name: 'Celulares', href: '/celulares', icon: Smartphone },
        { name: 'Chips', href: '/chips', icon: SmartphoneNfc },
        { name: 'Histórico', href: '/historico', icon: History },
    ];

    return (
        <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col p-4 print:hidden">
            <div className="mb-8 px-4 flex items-center justify-between">
                <div className="relative w-32 h-12 hidden md:block">
                    <Image 
                        src="/Logo-vorx.png" 
                        alt="Logo VORX COMPANY" 
                        fill
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
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-800 hover:text-blue-400`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto border-t border-slate-700 pt-4">
                <p className="text-xs text-slate-400 text-center">v0.1 - Painel de Controle</p>
            </div>
        </div>
    );
}
