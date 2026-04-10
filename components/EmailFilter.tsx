"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';

interface EmailFilterProps {
  emails: string[];
  currentEmail: string;
}

export default function EmailFilter({ emails, currentEmail }: EmailFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleEmailChange = (email: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (email === 'Todos') {
      params.delete('email');
    } else {
      params.set('email', email);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 bg-slate-100 p-1 px-2 rounded-lg border border-slate-200">
        <Mail size={14} className="text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Email Supervisionado:</span>
        <select
          value={currentEmail}
          onChange={(e) => handleEmailChange(e.target.value)}
          className="bg-white border-none text-slate-800 text-xs font-medium rounded-md focus:ring-0 focus:outline-none block p-1 py-0.5 cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <option value="Todos">Todos</option>
          <option value="somente_com_email">Somente com Email</option>
          {emails.sort().map((email) => (
            <option key={email} value={email}>
              {email}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
