'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { getTopicsByUserId, getPostsByUserId } from '@/services/forumService';
import { getOrdersByUserId } from '@/services/orderService';
import {
  Pencil,
  Route,
  ArrowRight,
  Receipt,
  MessageSquare,
  Sparkles,
  LogOut,
  MapPin,
  ChevronRight,
  Loader2,
  PlusCircle,
  Tags,
  LayoutGrid,
  Save,
} from 'lucide-react';
import Modal from '@/components/layout/Modal';
import toast from 'react-hot-toast';
import ProfileJsonLd from '@/components/shared/ProfileJsonLd';

interface PostContent {
  blocks: {
    type: string;
    data: {
      text: string;
    };
  }[];
}

const getPostPreview = (content: string): { text: string, type: string | null } => {
  try {
    const parsed: PostContent = typeof content === 'string' ? JSON.parse(content) : content;
    if (!parsed.blocks || parsed.blocks.length === 0) {
      return { text: "Pas d'aperçu disponible.", type: null };
    }

    // Find the first block with text content
    const firstTextBlock = parsed.blocks.find(block => block.data && block.data.text);

    if (firstTextBlock) {
      let text = firstTextBlock.data.text.replace(/<[^>]+>/g, ''); // Strip HTML tags
      if (text.length > 150) {
        text = text.substring(0, 150) + '...';
      }
      return { text, type: firstTextBlock.type };
    }

    return { text: "Pas d'aperçu disponible.", type: null };
  } catch (e) {
    return { text: "Impossible de générer l'aperçu.", type: 'error' };
  }
};

interface Topic {
  slug: string;
  title: string;
}

interface Post {
  id: number;
  content: string;
  topic: {
    title: string;
    slug: string;
  }[];
}

interface ItineraryGeneration {
  id: string;
  preferences: {
    duration: string;
    travelType: string;
    tripStyle: string;
  };
  selected_variant: string;
  offer_type: string;
  amount_paid: number;
  payment_status: string;
  status: string;
  created_at: string;
  delivered_at: string | null;
}

interface Order {
  id: number;
  created_at: string;
  total_amount: number;
  status: string;
}

// Order status pills — dark-aware, aligned with /profil/commandes.
const ORDER_STATUS: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'En attente', bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400' },
  paid: { label: 'Payée', bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400' },
  shipped: { label: 'Expédiée', bg: 'bg-sky-500/10', text: 'text-sky-700 dark:text-sky-400' },
  delivered: { label: 'Livrée', bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400' },
  cancelled: { label: 'Annulée', bg: 'bg-rose-500/10', text: 'text-rose-700 dark:text-rose-400' },
  refunded: { label: 'Remboursée', bg: 'bg-violet-500/10', text: 'text-violet-700 dark:text-violet-400' },
};

const QUICK_LINKS = [
  { href: '/mon-espace', label: 'Mon espace services', Icon: LayoutGrid },
  { href: '/mon-espace/itineraires', label: 'Mes itinéraires achetés', Icon: Route },
  { href: '/itineraire-personnalise-pour-les-philippines', label: 'Créer un itinéraire', Icon: PlusCircle },
  { href: '/forum-sur-les-philippines/nouveau-sujet', label: 'Poser une question au forum', Icon: MessageSquare },
  { href: '/meilleurs-plans-aux-philippines', label: 'Voir les bons plans', Icon: Tags },
];

const ProfilPage = () => {
  const { user, profile, loading, signOut, updateLocalProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recentTopics, setRecentTopics] = useState<Topic[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savedItineraries, setSavedItineraries] = useState<ItineraryGeneration[]>([]);

  useEffect(() => {
    if (user) {
      const fetchForumActivity = async () => {
        const { data: topics, error: topicsError } = await getTopicsByUserId(supabase, user.id);
        if (topicsError) {
          toast.error("Impossible de charger vos sujets.");
        } else {
          setRecentTopics(topics || []);
        }

        const { data: posts, error: postsError } = await getPostsByUserId(supabase, user.id);
        if (postsError) {
          toast.error("Impossible de charger vos messages.");
        } else {
          setRecentPosts(posts || []);
        }
      };
      const fetchOrders = async () => {
        const { data: ordersData, error: ordersError } = await getOrdersByUserId(supabase, user.id);
        if (ordersError) {
            toast.error("Impossible de charger vos commandes.");
        } else {
            setOrders(ordersData || []);
        }
      };
      const fetchItineraries = async () => {
        const { data: itinerariesData, error: itinerariesError } = await supabase
          .from('itinerary_generations')
          .select('id, preferences, selected_variant, offer_type, amount_paid, payment_status, status, created_at, delivered_at')
          .eq('user_id', user.id)
          .eq('payment_status', 'completed')
          .order('created_at', { ascending: false });
        if (itinerariesError) {
          console.error('Erreur chargement itinéraires:', itinerariesError);
        } else {
          setSavedItineraries(itinerariesData || []);
        }
      };
      fetchForumActivity();
      fetchOrders();
      fetchItineraries();
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !profile) return;

    setIsSavingProfile(true);
    const formData = new FormData(e.currentTarget);
    const updates: { [key: string]: string | File } = {};

    const newUsername = formData.get('modal-username') as string;
    const newBio = formData.get('modal-bio') as string;
    const newLocation = formData.get('modal-location') as string;
    const newWhatsapp = (formData.get('modal-whatsapp') as string)?.trim() || '';

    if (newUsername && newUsername !== profile.username) {
      updates.username = newUsername;
    }
    if (newBio !== (profile.bio || '')) {
      updates.bio = newBio;
    }
    if (newLocation !== (profile.location || '')) {
      updates.location = newLocation;
    }
    if (newWhatsapp !== (profile.whatsapp_number || '')) {
      // Sanitize: keep digits and leading +
      const cleaned = newWhatsapp.replace(/[\s.\-()]/g, '');
      if (cleaned === '' || /^\+?\d{8,16}$/.test(cleaned)) {
        updates.whatsapp_number = cleaned;
      } else {
        toast.error('Numéro WhatsApp invalide. Format international attendu (ex: +33612345678).');
        setIsSavingProfile(false);
        return;
      }
    }

    const avatarFile = formData.get('modal-avatar-file') as File;
    if (avatarFile && avatarFile.size > 0) {
      const fileName = `${user.id}/${Date.now()}-${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatarFile, {
          cacheControl: '31536000',
          upsert: false,
        });

      if (uploadError) {
        toast.error("Erreur lors de l'envoi de l'avatar.");
        console.error('Avatar upload error:', uploadError);
        setIsSavingProfile(false);
        return;
      }

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
      updates.avatar_url = urlData.publicUrl;
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase.from('profiles').update(updates as { [key: string]: string }).eq('id', user.id);

      if (error) {
        toast.error(`Erreur: ${error.message}`);
        console.error("Profile update error:", error);
      } else {
        toast.success("Profil mis à jour avec succès !");
        updateLocalProfile(updates);
        setIsEditModalOpen(false);
      }
    } else {
      toast("Aucune modification à enregistrer.");
      setIsEditModalOpen(false);
    }

    setIsSavingProfile(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-muted/40 pt-24">
        <div className="mx-auto max-w-[1200px] px-6 py-24 text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-primary" aria-hidden="true" />
          <p className="mt-4 text-[15px] text-muted-foreground">Chargement du profil…</p>
        </div>
      </main>
    );
  }

  if (!profile || !user) {
    return (
      <main className="min-h-screen bg-muted/40 pt-24">
        <div className="mx-auto max-w-[1200px] px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-destructive">Profil non trouvé</h1>
          <p className="mt-3 text-muted-foreground">Impossible de charger les informations du profil.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    );
  }

  const initial = (profile.username?.charAt(0) || '?').toUpperCase();
  const memberSince = new Date(profile.created_at).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
  const easyPlusActive = !!profile.easy_plus_expires_at && new Date(profile.easy_plus_expires_at) > new Date();
  const easyPlusExpiry = profile.easy_plus_expires_at
    ? new Date(profile.easy_plus_expires_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  const cardBase = 'rounded-2xl border border-border/60 bg-card shadow-card-rest';
  const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  return (
    <>
      <ProfileJsonLd profile={profile} />
      <main className="min-h-screen bg-muted/40 pt-24">
        <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-4">

          {/* Header */}
          <header className="mb-8">
            <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-strong">
              Mon compte
            </span>
            <h1 className="text-[clamp(1.75rem,3.5vw,2.375rem)] font-bold leading-[1.1] tracking-[-0.02em] text-ink">
              Bonjour, <span className="text-accent-strong">{profile.username}</span>
            </h1>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Votre profil, vos commandes et votre activité — tout au même endroit.
            </p>
          </header>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

            {/* Main column */}
            <div className="flex flex-col gap-5 lg:col-span-2">

              {/* Account information */}
              <section className={`${cardBase} p-6 sm:p-7`}>
                <div className="mb-6 flex items-center justify-between gap-4">
                  <h2 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">Informations du compte</h2>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className={`inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium text-primary transition-colors hover:text-primary/80 ${focusRing}`}
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    Modifier
                  </button>
                </div>

                <div className="flex items-center gap-5">
                  {profile.avatar_url ? (
                    <span className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                      <Image
                        src={profile.avatar_url}
                        alt={`Avatar de ${profile.username}`}
                        fill
                        sizes="72px"
                        className="object-cover"
                      />
                    </span>
                  ) : (
                    <span
                      className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-[26px] font-bold text-primary-foreground"
                      aria-hidden="true"
                    >
                      {initial}
                    </span>
                  )}

                  <dl className="grid min-w-0 flex-1 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div className="min-w-0">
                      <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Nom d&apos;utilisateur</dt>
                      <dd className="truncate text-[14.5px] font-medium text-ink">{profile.username}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">E-mail</dt>
                      <dd className="truncate text-[14.5px] font-medium text-ink">{user.email}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Membre depuis</dt>
                      <dd className="text-[14.5px] font-medium capitalize text-ink">{memberSince}</dd>
                    </div>
                    {profile.location && (
                      <div className="min-w-0">
                        <dt className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Localisation</dt>
                        <dd className="flex items-center gap-1.5 truncate text-[14.5px] font-medium text-ink">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                          {profile.location}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {profile.bio && (
                  <p className="mt-5 border-t border-border/60 pt-4 text-[14px] leading-relaxed text-muted-foreground">
                    {profile.bio}
                  </p>
                )}
              </section>

              {/* Purchased itineraries — banner link */}
              <Link
                href="/mon-espace/itineraires"
                className={`${cardBase} block p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card ${focusRing}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-accent-strong" aria-hidden="true">
                      <Route className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="mb-0.5 text-[17px] font-semibold leading-tight text-ink">Mes itinéraires achetés</h2>
                      <p className="text-[13px] text-muted-foreground">
                        {savedItineraries.length > 0
                          ? `${savedItineraries.length} itinéraire${savedItineraries.length > 1 ? 's' : ''} débloqué${savedItineraries.length > 1 ? 's' : ''} · carte, photos et détails dans Mon Espace`
                          : "Aucun itinéraire débloqué pour l'instant"}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-accent-foreground shadow-cta">
                    Voir tout
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>

              {/* Orders */}
              <section className={`${cardBase} p-6 sm:p-7`}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em] text-ink">
                    <Receipt className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Mes commandes
                  </h2>
                  {orders.length > 0 && (
                    <Link
                      href="/profil/commandes"
                      className={`inline-flex items-center gap-1 rounded-md text-[13px] font-medium text-primary transition-colors hover:text-primary/80 ${focusRing}`}
                    >
                      Historique
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  )}
                </div>

                {orders.length > 0 ? (
                  <ul className="m-0 list-none p-0">
                    {orders.map((order) => {
                      const status = ORDER_STATUS[order.status] || { label: order.status, bg: 'bg-muted', text: 'text-foreground' };
                      return (
                        <li
                          key={order.id}
                          className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 py-3.5 last:border-0"
                        >
                          <div className="min-w-0">
                            <p className="text-[14px] font-medium text-ink">Commande #{order.id}</p>
                            <p className="text-[12.5px] text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.05em]', status.bg, status.text].join(' ')}>
                              <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                              {status.label}
                            </span>
                            <span className="text-[14px] font-bold tabular-nums text-ink">
                              {Number(order.total_amount).toFixed(2)} €
                            </span>
                            <Link
                              href={`/profil/commandes/${order.id}`}
                              className={`rounded-md text-[13px] font-medium text-primary transition-colors hover:text-primary/80 ${focusRing}`}
                            >
                              Détails
                            </Link>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-[14px] italic text-muted-foreground">Vous n&apos;avez aucune commande pour le moment.</p>
                )}
              </section>

              {/* Forum activity */}
              <section className={`${cardBase} p-6 sm:p-7`}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em] text-ink">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Mon activité sur le forum
                  </h2>
                  <Link
                    href="/forum-sur-les-philippines"
                    className={`inline-flex items-center gap-1 rounded-md text-[13px] font-medium text-primary transition-colors hover:text-primary/80 ${focusRing}`}
                  >
                    Aller aux forums
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Derniers sujets créés
                    </h3>
                    {recentTopics.length > 0 ? (
                      <ul className="space-y-1.5">
                        {recentTopics.map((topic) => (
                          <li key={topic.slug}>
                            <Link
                              href={`/forum-sur-les-philippines/sujet/${topic.slug}`}
                              className={`inline-block rounded text-[14px] font-medium text-primary transition-colors hover:text-primary/80 ${focusRing}`}
                            >
                              {topic.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[14px] italic text-muted-foreground">Aucun sujet créé récemment.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Dernières réponses
                    </h3>
                    {recentPosts.length > 0 ? (
                      <div className="space-y-3">
                        {recentPosts.map((post) => {
                          const preview = getPostPreview(post.content);
                          const topic = post.topic && post.topic.length > 0 ? post.topic[0] : null;
                          return (
                            <div key={post.id} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                              {preview.type === 'quote' ? (
                                <p className="preview-quote-orange">&laquo;&nbsp;{preview.text}&nbsp;&raquo;</p>
                              ) : (
                                <p className="text-[13.5px] italic leading-relaxed text-muted-foreground">
                                  &laquo;&nbsp;{preview.text}&nbsp;&raquo;
                                </p>
                              )}
                              {topic ? (
                                <Link
                                  href={`/forum-sur-les-philippines/sujet/${topic.slug}#post-${post.id}`}
                                  className={`mt-1 inline-block rounded text-[12px] font-medium text-primary transition-colors hover:text-primary/80 ${focusRing}`}
                                >
                                  Voir le message dans «&nbsp;{topic.title}&nbsp;»
                                </Link>
                              ) : (
                                <p className="mt-1 text-[12px] text-muted-foreground">Message dans un sujet non disponible</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[14px] italic text-muted-foreground">Aucune réponse récente.</p>
                    )}
                  </div>
                </div>
              </section>
            </div>

            {/* Side column */}
            <div className="flex flex-col gap-5 lg:col-span-1">

              {/* Easy+ status — warm amber card */}
              <section className="rounded-2xl border border-accent/40 bg-accent/[0.07] p-6">
                <span className="mb-2.5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-strong">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Statut Easy+
                </span>
                <p className="mb-1 text-[14.5px] text-ink">
                  Statut actuel : <strong className="font-semibold">{easyPlusActive ? 'Membre Easy+' : 'Membre Standard'}</strong>
                </p>
                <p className="mb-4 text-[13px] leading-[1.55] text-muted-foreground">
                  {easyPlusActive && easyPlusExpiry
                    ? `Avantages actifs jusqu'au ${easyPlusExpiry}.`
                    : '−20 % chez nos partenaires, support prioritaire et guides premium.'}
                </p>
                <Link
                  href="/services"
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[14px] font-semibold text-accent-foreground shadow-cta transition-colors hover:bg-accent/90 ${focusRing}`}
                >
                  Découvrir Easy+
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </section>

              {/* Quick actions */}
              <section className={`${cardBase} p-6`}>
                <h2 className="mb-3 text-[15px] font-semibold text-ink">Actions rapides</h2>
                <ul className="m-0 list-none p-0">
                  {QUICK_LINKS.map(({ href, label, Icon }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`group flex items-center gap-3 border-b border-border/60 py-3 text-[14px] font-medium text-foreground transition-colors last:border-0 hover:text-primary ${focusRing}`}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden="true" />
                        <span className="min-w-0 flex-1 truncate">{label}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Sign out */}
              <button
                type="button"
                onClick={handleSignOut}
                className={`flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-[14px] font-semibold text-red-700 transition-colors hover:border-red-200 hover:bg-red-50 dark:text-red-400 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 ${focusRing}`}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier mon profil">
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label htmlFor="modal-username" className="block text-sm font-medium text-foreground">Nom d&apos;utilisateur</label>
            <input type="text" id="modal-username" name="modal-username" defaultValue={profile.username} className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="modal-bio" className="block text-sm font-medium text-foreground">Bio</label>
            <textarea id="modal-bio" name="modal-bio" rows={3} defaultValue={profile.bio || ''} placeholder="Aucune biographie." className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm"></textarea>
          </div>
          <div>
            <label htmlFor="modal-location" className="block text-sm font-medium text-foreground">Localisation</label>
            <input type="text" id="modal-location" name="modal-location" defaultValue={profile.location || ''} placeholder="Non spécifié" className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm" />
          </div>
          <div>
            <label htmlFor="modal-whatsapp" className="block text-sm font-medium text-foreground">Numéro WhatsApp <span className="font-normal text-muted-foreground">(format international)</span></label>
            <input type="tel" id="modal-whatsapp" name="modal-whatsapp" defaultValue={profile.whatsapp_number || ''} placeholder="+33 6 12 34 56 78" className="mt-1 block w-full rounded-md border border-border px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-ring sm:text-sm" />
            <p className="mt-1 text-xs text-muted-foreground">Requis si vous avez acheté un service avec support WhatsApp.</p>
          </div>
          <div>
            <label htmlFor="modal-avatar-file" className="block text-sm font-medium text-foreground">Changer l&apos;avatar</label>
            <input type="file" id="modal-avatar-file" name="modal-avatar-file" className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20" accept="image/*" />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/80">Annuler</button>
            <button type="submit" disabled={isSavingProfile} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:bg-muted">
              <Save className="h-3.5 w-3.5" aria-hidden="true" /> {isSavingProfile ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfilPage;
