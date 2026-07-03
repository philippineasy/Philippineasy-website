import { createClient } from '@/utils/supabase/server';

/**
 * Garde serveur pour les server actions / routes admin.
 * Vérifie via la session de l'appelant qu'il est admin (role super_admin | editor,
 * cf. is_admin() en base). À appeler AVANT toute écriture privilégiée effectuée
 * ensuite avec le service_role (qui bypasse RLS) — sinon l'action serait invocable
 * par n'importe quel utilisateur connecté.
 *
 * Lève une erreur si l'appelant n'est pas authentifié ou pas admin.
 */
export async function requireAdmin(): Promise<{ userId: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Non authentifié.');
  }

  // is_admin() est SECURITY DEFINER : lecture de profiles.role non affectée par
  // la révocation des UPDATE sur les colonnes sensibles.
  const { data: isAdmin, error } = await supabase.rpc('is_admin', { user_id: user.id });

  if (error || !isAdmin) {
    throw new Error('Accès réservé aux administrateurs.');
  }

  return { userId: user.id };
}
