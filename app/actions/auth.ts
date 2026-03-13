'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Cliente admin com service_role para operações privilegiadas
function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Email ou senha inválidos.' };
  }

  const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Admin sempre tem acesso — garante que o profile existe
  if (isAdmin) {
    const adminClient = createAdminClient();
    await adminClient.from('profiles').upsert({
      id: data.user.id,
      email: email,
      approved: true,
    }, { onConflict: 'id' });

    revalidatePath('/', 'layout');
    redirect('/');
  }

  // Usuários comuns: verificar aprovação
  const adminClient = createAdminClient();
  const { data: profile } = await adminClient
    .from('profiles')
    .select('approved')
    .eq('id', data.user.id)
    .single();

  if (!profile?.approved) {
    await supabase.auth.signOut();
    return { error: 'Sua conta está aguardando aprovação do administrador.' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createSupabaseServerClient();
  const adminClient = createAdminClient();

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    const isAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    await adminClient.from('profiles').insert({
      id: data.user.id,
      email: email,
      approved: isAdmin,
    });

    if (isAdmin) {
      revalidatePath('/', 'layout');
      redirect('/');
    }
  }

  // Usuário comum: deslogar e indicar que está pendente
  await supabase.auth.signOut();
  return { pendente: true };
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string;

  const supabase = await createSupabaseServerClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get('password') as string;

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: 'Não foi possível atualizar a senha. Tente novamente.' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
