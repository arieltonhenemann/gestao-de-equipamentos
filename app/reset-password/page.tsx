'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { updatePassword } from '@/app/actions/auth';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        setError('');
        const password = formData.get('password') as string;
        const confirm = formData.get('confirm') as string;

        if (password !== confirm) {
            setError('As senhas não coincidem.');
            return;
        }

        startTransition(async () => {
            const result = await updatePassword(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">

                <div className="flex justify-center mb-8">
                    <div className="relative w-44 h-20">
                        <Image src="/Logo-vorx.png" alt="Logo VORX COMPANY" fill sizes="176px" className="object-contain" priority />
                    </div>
                </div>

                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">

                    <div className="mb-8 text-center">
                        <div className="flex justify-center mb-3">
                            <div className="p-3 bg-purple-600/20 rounded-full">
                                <ShieldCheck size={28} className="text-purple-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Nova senha</h1>
                        <p className="text-slate-400 text-sm mt-1">Defina sua nova senha de acesso ao sistema</p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nova senha</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    placeholder="Mínimo 6 caracteres"
                                    className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Confirmar nova senha</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    name="confirm"
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    placeholder="Repita a nova senha"
                                    className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-purple-900/30"
                        >
                            {isPending ? (
                                <><Loader2 size={16} className="animate-spin" /> Aguarde...</>
                            ) : (
                                <><ShieldCheck size={16} /> Salvar nova senha</>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-slate-600 text-xs mt-6">
                    Gestão de Equipamentos — VORX COMPANY
                </p>
            </div>
        </div>
    );
}
