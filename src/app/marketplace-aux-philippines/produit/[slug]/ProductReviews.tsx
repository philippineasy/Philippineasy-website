'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { handleAddReview } from './actions';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

type Review = {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

type ProductReviewsProps = {
  productId: number;
  initialReviews: Review[];
  hasPurchased: boolean;
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5" aria-label={`Note ${rating} sur 5`}>
    {[...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={i < rating ? 'text-accent-strong' : 'text-muted-foreground/30'}
      />
    ))}
  </div>
);

const getInitials = (name?: string | null) => {
  if (!name) return '?';
  return name.trim().charAt(0).toUpperCase();
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

export const ProductReviews = ({ productId, initialReviews, hasPurchased }: ProductReviewsProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Veuillez sélectionner une note.');
      return;
    }
    setLoading(true);
    const result = await handleAddReview(productId, rating, comment);
    if (result.success && result.data) {
      toast.success('Avis ajouté !');
      setReviews(prev => [
        ...result.data!.map(r => ({
          ...r,
          profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles,
        })),
        ...prev,
      ]);
      setRating(0);
      setComment('');
    } else {
      toast.error(`Erreur: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2
        className="text-[clamp(1.375rem,2.5vw,1.75rem)] font-bold text-foreground"
        style={{ letterSpacing: '-0.01em' }}
      >
        Avis des clients
      </h2>

      {user && hasPurchased && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border-[0.5px] border-border bg-card p-6 shadow-card-rest"
        >
          <h3 className="text-[17px] font-semibold text-foreground">Laissez votre avis</h3>
          <div className="mt-4 flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                aria-label={`Donner ${i + 1} étoile${i > 0 ? 's' : ''}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FontAwesomeIcon
                  icon={faStar}
                  className={`text-xl ${i < rating ? 'text-accent-strong' : 'text-muted-foreground/30 hover:text-accent-strong/50'}`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="mt-4 w-full rounded-lg border border-border bg-background p-3 text-[15px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Votre commentaire (optionnel)"
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {loading ? 'Envoi…' : 'Envoyer mon avis'}
          </button>
        </form>
      )}

      <div className="mt-8 space-y-5">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <article
              key={review.id}
              className="rounded-2xl border-[0.5px] border-border bg-card p-5 shadow-card-rest"
            >
              <div className="flex items-start gap-4">
                <span
                  className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-[15px] font-bold text-primary"
                  aria-hidden="true"
                >
                  {getInitials(review.profiles?.username)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="font-semibold text-foreground">
                      {review.profiles?.username || 'Anonyme'}
                    </p>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {formatDate(review.created_at)}
                  </p>
                  {review.comment && (
                    <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border-[0.5px] border-dashed border-border bg-card/50 px-6 py-10 text-center">
            <p className="text-[15px] text-muted-foreground">
              Aucun avis pour ce produit pour le moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
