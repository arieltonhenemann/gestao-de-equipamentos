"use client";  // Client Component para form

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (formData: FormData) => {
        setLoading(true);
        setError('');

        const email = formData.get('email') as string;
        const senha = formData.get('senha') as string;

        // Simula auth (substitua por seu backend/API)
        if (email === 'user@test.com' && senha === '123456') {
            // Salva no cookie (simples)
            document.cookie = 'auth-token=valid; path=/; max-age=3600';
            router.push('/');  // Vai para página inicial
        } else {
            setError('Email ou senha inválidos');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-900">Login</h2>
                <form action={handleLogin}>
                    <div className="space-y-4">
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            className="w-full p-3 border border-gray-300 text-black placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            name="senha"
                            type="password"
                            required
                            placeholder="Senha"
                            className="w-full p-3 border border-gray-300 text-black placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
