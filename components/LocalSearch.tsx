"use client"

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function LocalSearch({ placeholder }: { placeholder: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setQuery(searchParams.get('q') || '');
    }, [searchParams]);

    const handleSearch = (val: string) => {
        setQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        
        debounceRef.current = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (val) {
                params.set('q', val);
            } else {
                params.delete('q');
            }
            router.push(`${pathname}?${params.toString()}`);
        }, 300);
    };

    const clearSearch = () => {
        setQuery('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        router.push(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="relative flex items-center">
                <Search className="absolute left-3 text-slate-400" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-10 py-2 bg-white border border-slate-200 rounded-xl shadow-sm text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-400"
                />
                {query.length > 0 && (
                    <button onClick={clearSearch} className="absolute right-3 text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                )}
            </div>
        </div>
    );
}
