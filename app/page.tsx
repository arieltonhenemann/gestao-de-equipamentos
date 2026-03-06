import { getDashboardStats } from '@/app/actions/dashboard';
import { Users, Laptop, Smartphone, SmartphoneNfc, Activity, CheckCircle2 } from 'lucide-react';
import DashboardSearch from '@/components/DashboardSearch';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const stats = await getDashboardStats();

  const cards = [
    { title: 'Funcionários', value: stats.funcionarios.total, icon: Users, color: 'bg-blue-500' },
    { title: 'Notebooks', value: stats.notebooks.total, sub: `${stats.notebooks.emUso} em uso`, sub2: `${stats.notebooks.disponivel} disponível`, icon: Laptop, color: 'bg-indigo-500' },
    { title: 'Celulares', value: stats.celulares.total, sub: `${stats.celulares.emUso} em uso`, sub2: `${stats.celulares.disponivel} disponível`, icon: Smartphone, color: 'bg-purple-500' },
    { title: 'Chips', value: stats.chips.total, sub: `${stats.chips.emUso} em uso`, sub2: `${stats.chips.disponivel} disponível`, icon: SmartphoneNfc, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardSearch />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex flex-col items-start hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-lg ${card.color} text-white mb-4`}>
                <Icon size={24} />
              </div>
              <h3 className="text-slate-500 font-medium text-sm">{card.title}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-1">{card.value}</p>

              <div className="flex gap-2 mt-2">
                {card.sub && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md">
                    <Activity size={12} className="text-emerald-500" />
                    {card.sub}
                  </div>
                )}
                {card.sub2 && (
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-md">
                    <CheckCircle2 size={12} className="text-blue-500" />
                    {card.sub2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
