'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabase/client';
import { getTopicsByUserId, getPostsByUserId } from '@/services/forumService';
import { getOrdersByUserId } from '@/services/orderService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faEdit, faRoute, faPlus, faComments, faStar, faMapSigns, faPencilAlt, faTags, faSignOutAlt, faSave, faTrash, faReceipt } from '@fortawesome/free-solid-svg-icons';
import Modal from '@/components/layout/Modal';
import toast from 'react-hot-toast';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
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

const ProfilPage = () => {
  const { user, profile, loading, signOut, updateLocalProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recentTopics, setRecentTopics] = useState<Topic[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savedItineraries, setSavedItineraries] = useState<ItineraryGeneration[]>([]);
  const [itineraryToDelete, setItineraryToDelete] = useState<ItineraryGeneration | null>(null);
  const [isRedelivering, setIsRedelivering] = useState<string | null>(null);

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
  }, [user, supabase]);

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

    if (newUsername && newUsername !== profile.username) {
      updates.username = newUsername;
    }
    if (newBio !== (profile.bio || '')) {
      updates.bio = newBio;
    }
    if (newLocation !== (profile.location || '')) {
      updates.location = newLocation;
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
  
  const handleDeleteRequest = (itinerary: ItineraryGeneration) => {
    setItineraryToDelete(itinerary);
  };

  const confirmDeleteItinerary = () => {
    // This is a placeholder as itinerary logic is not fully implemented
    toast.error("La suppression d'itinéraire n'est pas encore fonctionnelle.");
    setItineraryToDelete(null);
  };

  const handleRedeliverItinerary = async (itineraryId: string) => {
    if (!user?.email) {
      toast.error("Email non disponible");
      return;
    }
    setIsRedelivering(itineraryId);
    try {
      const response = await fetch('/api/itinerary/deliver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generation_id: itineraryId,
          delivery_method: 'email',
          email: user.email,
        }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Itinéraire renvoyé par email !");
      } else {
        toast.error(data.error || "Erreur lors de l'envoi");
      }
    } catch (err) {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setIsRedelivering(null);
    }
  };

  const getDurationLabel = (duration: string): string => {
    const labels: Record<string, string> = {
      '3-days': '3-5 jours',
      '1-week': '1 semaine',
      '10-days': '10 jours',
      '2-weeks': '2 semaines',
      '3-weeks': '3 semaines',
      '1-month': '1 mois',
      'more': '+1 mois',
    };
    return labels[duration] || duration;
  };

  const getOfferLabel = (offer: string): string => {
    const labels: Record<string, string> = {
      'express': 'Express',
      'premium': 'Premium',
      'conciergerie': 'Conciergerie',
    };
    return labels[offer] || offer;
  };

  const getVariantLabel = (variant: string): string => {
    const labels: Record<string, string> = {
      'relax': 'Relax',
      'balanced': 'Équilibré',
      'adventure': 'Aventure',
    };
    return labels[variant] || variant;
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-primary text-4xl"></i>
          <p className="mt-4 text-lg text-muted-foreground">Chargement du profil...</p>
        </div>
      </main>
    );
  }

  if (!profile || !user) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-destructive">Profil non trouvé</h1>
          <p className="mt-4 text-muted-foreground">Impossible de charger les informations du profil.</p>
          <Link href="/" className="mt-6 inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Retour à l'accueil
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <ProfileJsonLd profile={profile} />
      <main className="container mx-auto px-4 py-16 pt-32">
        <h1 className="text-3xl md:text-4xl font-bold mb-10">
          Bienvenue sur votre Espace, <span className="text-primary">{profile.username}</span> !
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center">
                <FontAwesomeIcon icon={faUserCircle} className="text-primary mr-3 text-2xl" /> Informations du Compte
              </h2>
              <div className="flex items-center mb-6">
                <div className="relative w-24 h-24 rounded-full mr-6 border-2 border-primary/20">
                  <Image src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}&background=random`} alt="Avatar" fill className="rounded-full object-cover" />
                </div>
                <div className="space-y-2 text-foreground flex-grow">
                  <p><span className="font-medium w-32 inline-block">Nom d'utilisateur:</span> {profile.username}</p>
                  <p><span className="font-medium w-32 inline-block">Email:</span> {user.email}</p>
                  <p><span className="font-medium w-32 inline-block">Membre depuis:</span> {new Date(profile.created_at).toLocaleDateString('fr-FR')}</p>
                  <p><span className="font-medium w-32 inline-block">Localisation:</span> {profile.location || 'Non spécifié'}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium text-foreground mb-2">Bio :</h3>
                <p className="text-muted-foreground italic">{profile.bio || 'Aucune biographie.'}</p>
              </div>
              <div className="mt-4 pt-4 border-t flex space-x-4">
                <button onClick={() => setIsEditModalOpen(true)} className="text-sm text-primary hover:underline">
                  <FontAwesomeIcon icon={faEdit} className="mr-1" /> Modifier le profil
                </button>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center">
                <FontAwesomeIcon icon={faRoute} className="text-accent mr-3 text-2xl" /> Mes Itinéraires Achetés
              </h2>
              <div className="space-y-4">
                {savedItineraries.length > 0 ? (
                  savedItineraries.map((itinerary) => (
                    <div key={itinerary.id} className="border-2 border-primary/20 p-4 rounded-lg hover:border-primary/40 transition-all">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              itinerary.selected_variant === 'relax' ? 'bg-blue-100 text-blue-700' :
                              itinerary.selected_variant === 'balanced' ? 'bg-green-100 text-green-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {getVariantLabel(itinerary.selected_variant)}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">
                              {getOfferLabel(itinerary.offer_type)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {getDurationLabel(itinerary.preferences?.duration)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Acheté le {new Date(itinerary.created_at).toLocaleDateString('fr-FR')} • {itinerary.amount_paid?.toFixed(2) || '0.00'}€
                          </p>
                          {itinerary.delivered_at && (
                            <p className="text-xs text-green-600 mt-1">
                              Envoyé le {new Date(itinerary.delivered_at).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRedeliverItinerary(itinerary.id)}
                            disabled={isRedelivering === itinerary.id}
                            className="px-3 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center gap-1"
                          >
                            {isRedelivering === itinerary.id ? (
                              <><i className="fas fa-spinner fa-spin"></i> Envoi...</>
                            ) : (
                              <><FontAwesomeIcon icon={faEdit} /> Renvoyer</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">Vous n'avez pas encore d'itinéraire acheté.</p>
                )}
              </div>
              <Link href="/itineraire-personnalise-pour-les-philippines" className="mt-6 inline-block px-5 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition duration-300 font-semibold text-sm">
                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Créer un nouvel itinéraire
              </Link>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center">
                    <FontAwesomeIcon icon={faReceipt} className="text-green-500 mr-3 text-2xl" /> Mes Commandes
                </h2>
                <div className="space-y-3">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order.id} className="border p-3 rounded-md hover:bg-muted flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Commande du {new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                                    <p className="text-sm text-muted-foreground">Total: {order.total_amount.toFixed(2)} € - Statut: {order.status}</p>
                                </div>
                                <Link href={`/profil/commandes/${order.id}`} className="text-primary hover:underline text-sm">Voir détails</Link>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground italic">Vous n'avez aucune commande pour le moment.</p>
                    )}
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 border-b pb-3 flex items-center">
                <FontAwesomeIcon icon={faComments} className="text-primary mr-3 text-2xl" /> Mon Activité sur le Forum
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Mes Derniers Sujets Créés :</h3>
                  <div className="space-y-2">
                    {recentTopics.length > 0 ? (
                      recentTopics.map((topic) => (
                        <Link key={topic.slug} href={`/forum-sur-les-philippines/sujet/${topic.slug}`} className="block text-primary hover:underline">{topic.title}</Link>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic">Aucun sujet créé récemment.</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-2">Mes Dernières Réponses :</h3>
                  <div className="space-y-2">
                    {recentPosts.length > 0 ? (
                      recentPosts.map((post) => {
                        const preview = getPostPreview(post.content);
                        const topic = post.topic && post.topic.length > 0 ? post.topic[0] : null;

                        return (
                          <div key={post.id} className="text-sm text-foreground mb-3 pb-3 border-b border-border last:border-b-0">
                            {preview.type === 'quote' ? (
                              <p className="preview-quote-orange">"{preview.text}"</p>
                            ) : (
                              <p className="italic">"{preview.text}"</p>
                            )}
                            {topic ? (
                              <Link href={`/forum-sur-les-philippines/sujet/${topic.slug}#post-${post.id}`} className="text-xs text-primary hover:underline mt-1 inline-block">
                                Voir le message dans "{topic.title}"
                              </Link>
                            ) : (
                              <p className="text-xs text-muted-foreground mt-1">Message dans un sujet non disponible</p>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground italic">Aucune réponse récente.</p>
                    )}
                  </div>
                </div>
              </div>
              <Link href="/forum-sur-les-philippines" className="mt-6 inline-block px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition duration-300 font-semibold text-sm">
                Aller aux Forums
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-br from-primary/10 to-secondary p-6 rounded-lg shadow-md border border-border">
          <h3 className="text-xl font-semibold mb-4 text-primary/90 flex items-center">
            <FontAwesomeIcon icon={faStar} className="text-accent/90 mr-2" /> Statut Philippin'Easy+
          </h3>
          <div>
            <p className="text-foreground mb-1">Statut actuel: <span className="font-bold text-foreground">Membre Standard</span></p>
            <p className="text-sm text-muted-foreground mb-4">Passez Premium pour des avantages exclusifs !</p>
          </div>
          <Link href="/meilleurs-plans#premium" className="inline-block w-full text-center px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-card-foreground rounded-lg shadow hover:from-yellow-500 hover:to-yellow-600 transition duration-300 font-semibold">
            Découvrir Easy+
          </Link>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Actions Rapides</h3>
          <ul className="space-y-2">
            <li><Link href="/itineraire-personnalise-pour-les-philippines" className="flex items-center text-primary hover:underline"><FontAwesomeIcon icon={faMapSigns} className="w-5 mr-2 text-center" /> Créer un itinéraire</Link></li>
            <li><Link href="/forum-sur-les-philippines/nouveau-sujet" className="flex items-center text-primary hover:underline"><FontAwesomeIcon icon={faPencilAlt} className="w-5 mr-2 text-center" /> Poser une question</Link></li>
            <li><Link href="/meilleurs-plans" className="flex items-center text-primary hover:underline"><FontAwesomeIcon icon={faTags} className="w-5 mr-2 text-center" /> Voir les bons plans</Link></li>
          </ul>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md text-center">
          <button onClick={handleSignOut} className="w-full px-5 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition duration-300 font-medium">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Se Déconnecter
          </button>
        </div>
      </div>
    </div>
  </main>

  <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier mon profil">
    <form onSubmit={handleProfileUpdate} className="space-y-4">
      <div>
        <label htmlFor="modal-username" className="block text-sm font-medium text-foreground">Nom d'utilisateur</label>
        <input type="text" id="modal-username" name="modal-username" defaultValue={profile.username} className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-primary sm:text-sm" required />
      </div>
      <div>
        <label htmlFor="modal-bio" className="block text-sm font-medium text-foreground">Bio</label>
        <textarea id="modal-bio" name="modal-bio" rows={3} defaultValue={profile.bio || ''} placeholder="Aucune biographie." className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-primary sm:text-sm"></textarea>
      </div>
      <div>
        <label htmlFor="modal-location" className="block text-sm font-medium text-foreground">Localisation</label>
        <input type="text" id="modal-location" name="modal-location" defaultValue={profile.location || ''} placeholder="Non spécifié" className="mt-1 block w-full px-3 py-2 border border-border rounded-md shadow-sm focus:outline-none focus:ring-ring focus:border-primary sm:text-sm" />
      </div>
      <div>
        <label htmlFor="modal-avatar-file" className="block text-sm font-medium text-foreground">Changer l'avatar</label>
        <input type="file" id="modal-avatar-file" name="modal-avatar-file" className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" accept="image/*" />
      </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-foreground bg-muted hover:bg-muted/80 rounded-md">Annuler</button>
            <button type="submit" disabled={isSavingProfile} className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md disabled:bg-muted">
              <FontAwesomeIcon icon={faSave} className="mr-1" /> {isSavingProfile ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
  </Modal>

  {itineraryToDelete && (
    <ConfirmationModal
      isOpen={!!itineraryToDelete}
      onClose={() => setItineraryToDelete(null)}
      onConfirm={confirmDeleteItinerary}
      title="Confirmer la suppression"
    >
      <p>Êtes-vous sûr de vouloir supprimer cet itinéraire {getVariantLabel(itineraryToDelete.selected_variant)} ({getOfferLabel(itineraryToDelete.offer_type)}) ?</p>
    </ConfirmationModal>
  )}
</>
);
};

export default ProfilPage;
