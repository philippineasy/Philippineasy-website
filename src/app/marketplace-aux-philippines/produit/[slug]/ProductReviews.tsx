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
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ))}
  </div>
);

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
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Avis des clients</h2>

      {user && hasPurchased && (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Laissez votre avis</h3>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <button key={i} type="button" onClick={() => setRating(i + 1)}>
                <FontAwesomeIcon
                  icon={faStar}
                  className={`w-6 h-6 ${i < rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full p-2 border rounded-md"
            placeholder="Votre commentaire (optionnel)"
          ></textarea>
          <button type="submit" disabled={loading} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
            {loading ? 'Envoi...' : 'Envoyer mon avis'}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <div key={review.id} className="flex space-x-4">
              <div className="flex-shrink-0">
                {/* Avatar logic here */}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-bold">{review.profiles?.username || 'Anonyme'}</p>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
                <p className="mt-2">{review.comment}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun avis pour ce produit pour le moment.</p>
        )}
      </div>
    </div>
  );
};