'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { DatingProfile, Interest, DatingPhoto } from '@/types';
import CitySelector from '@/components/shared/CitySelector';
import { supabase } from '@/utils/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { updateDatingProfile, UpdateDatingProfilePayload, uploadNewPhoto, deletePhoto } from '../actions';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CustomSelect } from '@/components/shared/CustomSelect';
import ConfirmationModal from '@/components/shared/ConfirmationModal';
import { ORIENTATION_OPTIONS, RELIGION_OPTIONS, DATING_INTENT_OPTIONS, YES_NO_MAYBE_OPTIONS, FINANCIAL_STABILITY_OPTIONS, PARTNER_MOVE_OPTIONS, FOREINGNER_KINKY_OPTIONS, PARTNER_NOT_KINKY_OPTIONS, MONEY_IMPORTANCE_OPTIONS } from '@/config/dating';
import { questionMap } from '@/utils/dating/questions';

type FormData = Omit<UpdateDatingProfilePayload, 'gender' | 'height'>;

const EditDatingProfilePage = () => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      answers: [
        { question_key: 'foreign_country', answer: '' },
        { question_key: 'money_importance', answer: '' },
        { question_key: 'foreigner_kinky', answer: '' },
      ],
    }
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [photos, setPhotos] = useState<DatingPhoto[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<DatingPhoto | null>(null);
  
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [staticProfileData, setStaticProfileData] = useState<{gender: string, height: number | null}>({ gender: '', height: null });

  const watchedInterests = watch('interests') || [];

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      
      const { data: profileData, error: profileError } = await supabase
        .from('dating_profiles')
        .select('*, interests(id)')
        .eq('user_id', user.id)
        .single();

      if (profileError || !profileData) {
        setError("Profil de rencontre non trouvé.");
        setInitialLoading(false);
        return;
      }
      
      setStaticProfileData({ gender: profileData.gender, height: profileData.height });

      Object.keys(profileData).forEach(key => {
        if (key === 'interests') {
          setValue('interests', profileData.interests.map((i: any) => i.id.toString()));
        } else if (key === 'profile_picture_url' && profileData[key]) {
          setSelectedPhotoUrl(profileData[key]);
        } else if (key !== 'gender' && key !== 'height') { // Don't set these as form values
          setValue(key as keyof FormData, profileData[key]);
        }
      });
      
      const { data: allInterests } = await supabase.from('interests').select('*');
      if (allInterests) setInterests(allInterests);

      const { data: allPhotos } = await supabase
        .from('dating_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('sort_order', { ascending: true });
      if (allPhotos) setPhotos(allPhotos);

      const { data: answersData } = await supabase
        .from('dating_question_answers')
        .select('question_key, answer')
        .eq('profile_id', user.id);
      
      if (answersData) {
        const defaultAnswers = [
          { question_key: 'foreign_country', answer: '' },
          { question_key: 'money_importance', answer: '' },
          { question_key: 'foreigner_kinky', answer: '' },
          { question_key: 'partner_move', answer: '' },
          { question_key: 'financial_stability', answer: '' },
          { question_key: 'partner_not_kinky', answer: '' },
        ];

        const mergedAnswers = defaultAnswers.map(defaultAnswer => {
          const foundAnswer = answersData.find(dbAnswer => dbAnswer.question_key === defaultAnswer.question_key);
          return foundAnswer || defaultAnswer;
        });

        setValue('answers', mergedAnswers);
      }

      setInitialLoading(false);
    };

    fetchProfileData();
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) throw new Error("Utilisateur non authentifié");

      const result = await updateDatingProfile({ 
        ...data, 
        profile_picture_url: selectedPhotoUrl || undefined
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      toast.success('Profil mis à jour avec succès !');
      router.push(`/rencontre-philippines/profil/${user.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const result = await uploadNewPhoto(formData);
      if (result.error) {
        throw new Error(result.error);
      }
      // Refresh photos list
      const { data: allPhotos } = await supabase
        .from('dating_photos')
        .select('*')
        .eq('user_id', user!.id)
        .order('sort_order', { ascending: true });
      if (allPhotos) setPhotos(allPhotos);
      toast.success('Photo téléversée ! Elle est en attente de modération.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePhotoDeleteRequest = (photo: DatingPhoto) => {
    setPhotoToDelete(photo);
  };

  const confirmPhotoDelete = async () => {
    if (!photoToDelete) return;
    try {
      const result = await deletePhoto(photoToDelete.id, photoToDelete.image_url);
      if (result.error) {
        throw new Error(result.error);
      }
      setPhotos(prev => prev.filter(p => p.id !== photoToDelete.id));
      if (selectedPhotoUrl === photoToDelete.image_url) {
        setSelectedPhotoUrl(null);
      }
      toast.success('Photo supprimée.');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPhotoToDelete(null);
    }
  };

  if (initialLoading) {
    return <div className="text-center p-12">Chargement de votre profil...</div>;
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Vos Informations</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea id="description" {...register('description', { required: 'La description est requise.' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" rows={5}></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Genre</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{staticProfileData.gender}</p>
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700">Taille</label>
                      <p className="mt-1 text-lg font-semibold text-gray-900">{staticProfileData.height ? `${staticProfileData.height} cm` : 'Non spécifiée'}</p>
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: 'La ville est requise.' }}
                        render={({ field }) => (
                          <CitySelector
                            value={field.value || null}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Orientation Sexuelle</label>
                      <Controller
                        name="orientation"
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            options={ORIENTATION_OPTIONS}
                            placeholder="Sélectionnez..."
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Religion</label>
                      <Controller
                        name="religion"
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            options={RELIGION_OPTIONS}
                            placeholder="Sélectionnez..."
                          />
                        )}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Que recherchez-vous ?</label>
                      <Controller
                        name="dating_intent"
                        control={control}
                        render={({ field }) => (
                          <CustomSelect
                            {...field}
                            options={DATING_INTENT_OPTIONS}
                            placeholder="Sélectionnez..."
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Questionnaire</h2>
                <div className="space-y-6">
                  {staticProfileData.gender === 'Femme' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">{questionMap.foreign_country}</label>
                        <Controller name="answers.0.answer" control={control} render={({ field }) => <CustomSelect {...field} options={YES_NO_MAYBE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.0.question_key')} value="foreign_country" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">{questionMap.money_importance}</label>
                        <Controller name="answers.1.answer" control={control} render={({ field }) => <CustomSelect {...field} options={MONEY_IMPORTANCE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.1.question_key')} value="money_importance" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">{questionMap.foreigner_kinky}</label>
                        <Controller name="answers.2.answer" control={control} render={({ field }) => <CustomSelect {...field} options={FOREINGNER_KINKY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.2.question_key')} value="foreigner_kinky" />
                      </div>
                    </>
                  )}
                  {staticProfileData.gender === 'Homme' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">{questionMap.partner_move}</label>
                        <Controller name="answers.0.answer" control={control} render={({ field }) => <CustomSelect {...field} options={PARTNER_MOVE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.0.question_key')} value="partner_move" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">{questionMap.financial_stability}</label>
                        <Controller name="answers.1.answer" control={control} render={({ field }) => <CustomSelect {...field} options={FINANCIAL_STABILITY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.1.question_key')} value="financial_stability" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">{questionMap.partner_not_kinky}</label>
                        <Controller name="answers.2.answer" control={control} render={({ field }) => <CustomSelect {...field} options={PARTNER_NOT_KINKY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.2.question_key')} value="partner_not_kinky" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Centres d'intérêt</h2>
                <div className="flex flex-wrap gap-3">
                  {interests.map(interest => (
                    <div key={interest.id}>
                      <input type="checkbox" id={`interest-edit-${interest.id}`} value={interest.id.toString()} {...register('interests')} className="hidden peer" defaultChecked={watchedInterests.includes(interest.id.toString())} />
                      <label htmlFor={`interest-edit-${interest.id}`} className="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-50">
                        <div className="block">
                          <div className="w-full text-lg">{interest.icon} {interest.name}</div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8 order-1 lg:order-2">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Gérer vos Photos</h2>
                <p className="text-sm text-gray-500 mb-4">Cliquez sur une photo approuvée pour la définir comme photo de profil. Les nouvelles photos sont en attente de modération.</p>
                <div className="grid grid-cols-3 gap-4">
                  {photos.map(photo => (
                    <div key={photo.id} className="relative group">
                      <div 
                        className={`aspect-square rounded-lg overflow-hidden border-4 ${selectedPhotoUrl === photo.image_url && photo.status === 'approved' ? 'border-primary' : 'border-transparent'} ${photo.status !== 'approved' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => photo.status === 'approved' && setSelectedPhotoUrl(photo.image_url)}
                      >
                        <img src={photo.image_url} alt="Photo" className="w-full h-full object-cover" />
                        {photo.status !== 'approved' && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-center p-1">
                            <span className="text-xs font-bold">{photo.status === 'pending' ? 'En attente' : 'Rejetée'}</span>
                          </div>
                        )}
                      </div>
                      <button 
                        type="button"
                        onClick={() => handlePhotoDeleteRequest(photo)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Supprimer la photo"
                      >
                        <FontAwesomeIcon icon={faTrash} size="xs" />
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <label htmlFor="photo-upload" className="cursor-pointer text-center text-gray-500 hover:text-primary">
                      {isUploading ? (
                        <FontAwesomeIcon icon={faSpinner} spin className="text-2xl" />
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faUpload} className="text-2xl" />
                          <span className="mt-1 block text-sm">Ajouter</span>
                        </>
                      )}
                    </label>
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={isUploading} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <button type="submit" disabled={isLoading} className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors disabled:bg-gray-400">
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>

        <ConfirmationModal
          isOpen={!!photoToDelete}
          onClose={() => setPhotoToDelete(null)}
          onConfirm={confirmPhotoDelete}
          title="Confirmer la suppression"
        >
          <p>Êtes-vous sûr de vouloir supprimer cette photo ?</p>
        </ConfirmationModal>
      </div>
    </div>
  );
};

export default EditDatingProfilePage;
