'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { login, signup, forgotPassword } from '@/app/actions/auth';
import { Mail, Lock, Eye, EyeOff, UserPlus, LogIn, Loader2, KeyRound, ArrowLeft } from 'lucide-react';

type Mode = 'login' | 'signup' | 'forgot';

export default function LoginPage() {
    const [mode, setMode] = useState<Mode>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPending, startTransition] = useTransition();

    function switchMode(newMode: Mode) {
        setMode(newMode);
        setError('');
        setSuccess('');
        setShowPassword(false);
    }

    async function handleSubmit(formData: FormData) {
        setError('');
        setSuccess('');
        startTransition(async () => {
            if (mode === 'forgot') {
                const result = await forgotPassword(formData);
                if (result?.error) {
                    setError(result.error);
                } else {
                    setSuccess('Email de recuperação enviado! Verifique sua caixa de entrada.');
                }
                return;
            }
            const action = mode === 'login' ? login : signup;
            const result = await action(formData);
            if (result?.error) {
                setError(result.error);
            } else if ('pendente' in (result ?? {}) && (result as { pendente?: boolean })?.pendente) {
                setSuccess('Conta criada! Aguardando aprovação do administrador. Você receberá acesso em breve.');
                switchMode('login');
            }
        });
    }

    const titles: Record<Mode, string> = {
        login: 'Bem-vindo de volta',
        signup: 'Criar conta',
        forgot: 'Recuperar senha',
    };
    const subtitles: Record<Mode, string> = {
        login: 'Entre com suas credenciais para acessar o sistema',
        signup: 'Preencha os dados abaixo para criar seu acesso',
        forgot: 'Digite seu email e enviaremos um link para redefinir sua senha',
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">

            {/* Background glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-700/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-700/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative w-44 h-20">
                        <Image
                            src="/Logo-vorx.png"
                            alt="Logo VORX COMPANY"
                            fill
                            sizes="176px"
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">

                    {/* Header */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-white">{titles[mode]}</h1>
                        <p className="text-slate-400 text-sm mt-1">{subtitles[mode]}</p>
                    </div>

                    {/* Toggle login/signup — oculto no modo forgot */}
                    {mode !== 'forgot' && (
                        <div className="flex bg-slate-800 rounded-xl p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => switchMode('login')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'login' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <LogIn size={15} /> Entrar
                            </button>
                            <button
                                type="button"
                                onClick={() => switchMode('signup')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'signup' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <UserPlus size={15} /> Criar conta
                            </button>
                        </div>
                    )}

                    {/* Form */}
                    <form action={handleSubmit} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="seu@email.com"
                                    className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Senha — oculta no modo forgot */}
                        {mode !== 'forgot' && (
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-medium text-slate-300">Senha</label>
                                    {mode === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => switchMode('forgot')}
                                            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                                        >
                                            Esqueci minha senha
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                                        className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Mensagens */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-lg px-4 py-3">
                                {success}
                            </div>
                        )}

                        {/* Botão submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-purple-900/30"
                        >
                            {isPending ? (
                                <><Loader2 size={16} className="animate-spin" /> Aguarde...</>
                            ) : mode === 'login' ? (
                                <><LogIn size={16} /> Entrar no sistema</>
                            ) : mode === 'signup' ? (
                                <><UserPlus size={16} /> Criar minha conta</>
                            ) : (
                                <><KeyRound size={16} /> Enviar link de recuperação</>
                            )}
                        </button>

                        {/* Voltar ao login (modo forgot) */}
                        {mode === 'forgot' && (
                            <button
                                type="button"
                                onClick={() => switchMode('login')}
                                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors py-1"
                            >
                                <ArrowLeft size={14} /> Voltar ao login
                            </button>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-600 text-xs mt-6">
                    Gestão de Equipamentos — VORX COMPANY
                </p>
            </div>
        </div>
    );
}
