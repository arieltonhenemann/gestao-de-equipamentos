'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getProfiles() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function approveUser(userId: string) {
  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from('profiles')
    .update({ approved: true })
    .eq('id', userId);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/usuarios');
}

export async function rejectUser(userId: string) {
  const adminClient = createAdminClient();

  // Remove o perfil
  await adminClient.from('profiles').delete().eq('id', userId);

  // Remove o usuário do auth
  await adminClient.auth.admin.deleteUser(userId);

  revalidatePath('/admin/usuarios');
}
