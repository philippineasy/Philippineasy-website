'use server';

import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function handleVendorApplication(formData: FormData) {
  const supabase = await createClient();

  let { data: { user } } = await supabase.auth.getUser();

  // User creation if not logged in
  if (!user) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { success: false, message: 'Email et mot de passe sont requis.' };
    }
    if (password.length < 6) {
      return { success: false, message: 'Le mot de passe doit contenir au moins 6 caractères.' };
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      if (signUpError.code === 'over_email_send_rate_limit') {
        return { success: false, message: "Vous avez essayé de vous inscrire trop de fois. Veuillez réessayer dans quelques minutes." };
      }
      if (signUpError.code === 'email_address_invalid') {
        return { success: false, message: "L'adresse e-mail que vous avez fournie n'est pas valide." };
      }
      return { success: false, message: signUpError.message };
    }
    
    user = signUpData.user;

    if (!user) {
      return { success: false, message: 'La création du compte a échoué. Veuillez réessayer.' };
    }
  }

  const vendorName = formData.get('vendorName') as string;
  const vendorDescription = formData.get('vendorDescription') as string;

  if (!vendorName || !vendorDescription) {
    return { success: false, message: 'Veuille_z remplir tous les champs de la boutique.' };
  }

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error: vendorError } = await supabaseAdmin.from('vendors').insert({
    user_id: user.id,
    name: vendorName,
    description: vendorDescription,
    status: 'pending',
  });

  if (vendorError) {
    console.error('Error creating vendor application:', vendorError);
    return { success: false, message: vendorError.message };
  }

  revalidatePath('/marketplace-aux-philippines/devenir-vendeur');
  return { success: true };
}
