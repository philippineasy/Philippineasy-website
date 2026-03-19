'use client';

import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Interest } from '@/types';
import { createManualProfile } from './actions';
import { CustomSelect } from '@/components/shared/CustomSelect';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  GENDER_OPTIONS,
  ORIENTATION_OPTIONS,
  RELIGION_OPTIONS,
  EDUCATION_OPTIONS,
  DATING_INTENT_OPTIONS,
  YES_NO_MAYBE_OPTIONS,
  MONEY_IMPORTANCE_OPTIONS,
  FOREINGNER_KINKY_OPTIONS,
  PARTNER_MOVE_OPTIONS,
  FINANCIAL_STABILITY_OPTIONS,
  PARTNER_NOT_KINKY_OPTIONS,
} from '@/config/dating';

const CitySelector = dynamic(() => import('@/components/shared/CitySelector'), { ssr: false });

type FormValues = {
  email: string;
  password: string;
  username: string;
  gender: string;
  orientation: string;
  day: string;
  month: string;
  year: string;
  city: string;
  height: string;
  religion: string;
  education: string;
  occupation: string;
  dating_intent: string;
  description: string;
  interests: string[];
  answers: { question_key: string; answer: string }[];
  auto_validate: boolean;
  grant_premium: boolean;
  premium_duration: string;
};

function generatePassword(length = 12): string {
  const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function AddProfileClient({ interests }: { interests: Interest[] }) {
  const { register, handleSubmit, watch, control, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: generatePassword(),
      username: '',
      gender: 'femme',
      orientation: 'hétérosexuel(le)',
      day: '',
      month: '',
      year: '',
      city: '',
      height: '',
      religion: 'christianity',
      education: '',
      occupation: '',
      dating_intent: 'serious_relationship',
      description: '',
      interests: [],
      answers: [
        { question_key: '', answer: '' },
        { question_key: '', answer: '' },
        { question_key: '', answer: '' },
      ],
      auto_validate: true,
      grant_premium: true,
      premium_duration: 'permanent',
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ userId: string; email: string; password: string } | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gender = watch('gender');
  const selectedInterests = watch('interests') || [];
  const grantPremium = watch('grant_premium');
  const description = watch('description') || '';

  const onSubmit = async (data: FormValues) => {
    if (photos.length === 0) {
      setError('Au moins une photo est requise.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('username', data.username);
    formData.append('gender', data.gender);
    formData.append('orientation', data.orientation);
    formData.append('day', data.day);
    formData.append('month', data.month);
    formData.append('year', data.year);
    formData.append('city', data.city);
    formData.append('height', data.height);
    formData.append('religion', data.religion);
    formData.append('education', data.education);
    formData.append('occupation', data.occupation);
    formData.append('dating_intent', data.dating_intent);
    formData.append('description', data.description);
    formData.append('auto_validate', String(data.auto_validate));
    formData.append('grant_premium', String(data.grant_premium));
    formData.append('premium_duration', data.premium_duration);

    // Interests
    data.interests.forEach(id => formData.append('interests', id));

    // Answers
    data.answers.forEach((answer, i) => {
      if (answer.question_key && answer.answer) {
        formData.append(`answers.${i}.question_key`, answer.question_key);
        formData.append(`answers.${i}.answer`, answer.answer);
      }
    });

    // Photos
    photos.forEach(photo => formData.append('photos', photo));

    const result = await createManualProfile(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess({ userId: result.userId!, email: result.email!, password: result.password! });
    }

    setIsLoading(false);
  };

  const handleNewProfile = () => {
    setSuccess(null);
    setError(null);
    setPhotos([]);
    reset({
      email: '',
      password: generatePassword(),
      username: '',
      gender: 'femme',
      orientation: 'hétérosexuel(le)',
      day: '',
      month: '',
      year: '',
      city: '',
      height: '',
      religion: 'christianity',
      education: '',
      occupation: '',
      dating_intent: 'serious_relationship',
      description: '',
      interests: [],
      answers: [
        { question_key: '', answer: '' },
        { question_key: '', answer: '' },
        { question_key: '', answer: '' },
      ],
      auto_validate: true,
      grant_premium: true,
      premium_duration: 'permanent',
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Success screen
  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 max-w-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Profil cree avec succes</h2>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-6">
          <p className="text-sm"><span className="font-medium text-gray-700">User ID:</span> <code className="text-xs bg-gray-200 px-1 rounded">{success.userId}</code></p>
          <p className="text-sm"><span className="font-medium text-gray-700">Email:</span> {success.email}</p>
          <p className="text-sm"><span className="font-medium text-gray-700">Mot de passe:</span> <code className="bg-yellow-100 px-2 py-0.5 rounded font-mono">{success.password}</code></p>
        </div>
        <p className="text-xs text-gray-500 mb-6">Notez bien le mot de passe, il ne sera plus visible apres.</p>
        <div className="flex gap-3">
          <button
            onClick={handleNewProfile}
            className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Ajouter un autre profil
          </button>
          <Link
            href="/admin/dating/profiles"
            className="flex-1 text-center bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Voir la liste
          </Link>
        </div>
      </div>
    );
  }

  const interestsByCategory = interests.reduce((acc, interest) => {
    const category = interest.category || 'Autres';
    if (!acc[category]) acc[category] = [];
    acc[category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Section: Compte */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 pb-2 border-b">Compte utilisateur</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              {...register('email', { required: 'Email requis' })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="maria@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe *</label>
            <div className="flex gap-2">
              <input
                type="text"
                {...register('password', { required: 'Mot de passe requis', minLength: { value: 8, message: 'Min 8 caracteres' } })}
                className="flex-1 p-2 border rounded font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom d&apos;utilisateur *</label>
            <input
              type="text"
              {...register('username', { required: 'Username requis' })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Maria_28"
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
        </div>
      </div>

      {/* Section: Profil de base */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 pb-2 border-b">Profil de base</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: 'Requis' }}
              render={({ field }) => <CustomSelect {...field} options={GENDER_OPTIONS} />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Orientation *</label>
            <Controller
              name="orientation"
              control={control}
              rules={{ required: 'Requis' }}
              render={({ field }) => <CustomSelect {...field} options={ORIENTATION_OPTIONS} />}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance *</label>
            <div className="grid grid-cols-3 gap-3">
              <Controller
                name="day"
                control={control}
                rules={{ required: 'Jour requis' }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    options={Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))}
                    placeholder="Jour"
                  />
                )}
              />
              <Controller
                name="month"
                control={control}
                rules={{ required: 'Mois requis' }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))}
                    placeholder="Mois"
                  />
                )}
              />
              <Controller
                name="year"
                control={control}
                rules={{ required: 'Annee requise' }}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    options={Array.from({ length: 50 }, (_, i) => ({ value: new Date().getFullYear() - 18 - i, label: `${new Date().getFullYear() - 18 - i}` }))}
                    placeholder="Annee"
                  />
                )}
              />
            </div>
            {(errors.day || errors.month || errors.year) && (
              <p className="text-red-500 text-xs mt-1">Date de naissance incomplete</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
            <Controller
              name="city"
              control={control}
              rules={{ required: 'Ville requise' }}
              render={({ field }) => <CitySelector value={field.value} onChange={field.onChange} />}
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
        </div>
      </div>

      {/* Section: Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 pb-2 border-b">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taille (cm)</label>
            <Controller
              name="height"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  options={Array.from({ length: 81 }, (_, i) => ({ value: i + 140, label: `${i + 140} cm` }))}
                  placeholder="Taille"
                />
              )}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
            <Controller
              name="religion"
              control={control}
              render={({ field }) => <CustomSelect {...field} options={RELIGION_OPTIONS} />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d&apos;etudes</label>
            <Controller
              name="education"
              control={control}
              render={({ field }) => <CustomSelect {...field} options={EDUCATION_OPTIONS} />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
            <input
              type="text"
              {...register('occupation')}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Nurse, Teacher..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Intention</label>
            <Controller
              name="dating_intent"
              control={control}
              render={({ field }) => <CustomSelect {...field} options={DATING_INTENT_OPTIONS} />}
            />
          </div>
        </div>
      </div>

      {/* Section: Questions personnelles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 pb-2 border-b">Questions personnelles</h2>
        {gender === 'femme' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ouverte a s&apos;installer a l&apos;etranger ?
              </label>
              <Controller
                name="answers.0.answer"
                control={control}
                render={({ field }) => <CustomSelect {...field} options={YES_NO_MAYBE_OPTIONS} />}
              />
              <input type="hidden" {...register('answers.0.question_key')} value="foreign_country" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Importance de la securite financiere ?
              </label>
              <Controller
                name="answers.1.answer"
                control={control}
                render={({ field }) => <CustomSelect {...field} options={MONEY_IMPORTANCE_OPTIONS} />}
              />
              <input type="hidden" {...register('answers.1.question_key')} value="money_importance" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Approche de l&apos;intimite ?
              </label>
              <Controller
                name="answers.2.answer"
                control={control}
                render={({ field }) => <CustomSelect {...field} options={FOREINGNER_KINKY_OPTIONS} />}
              />
              <input type="hidden" {...register('answers.2.question_key')} value="foreigner_kinky" />
            </div>
          </div>
        )}
        {gender === 'homme' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pret a accueillir la partenaire dans son pays ?
              </label>
              <Controller
                name="answers.0.answer"
                control={control}
                render={({ field }) => <CustomSelect {...field} options={PARTNER_MOVE_OPTIONS} />}
              />
              <input type="hidden" {...register('answers.0.question_key')} value="partner_move" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perspective sur le soutien financier ?
              </label>
              <Controller
                name="answers.1.answer"
                control={control}
                render={({ field }) => <CustomSelect {...field} options={FINANCIAL_STABILITY_OPTIONS} />}
              />
              <input type="hidden" {...register('answers.1.question_key')} value="financial_stability" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Harmonie et douceur dans l&apos;intimite ?
              </label>
              <Controller
                name="answers.2.answer"
                control={control}
                render={({ field }) => <CustomSelect {...field} options={PARTNER_NOT_KINKY_OPTIONS} />}
              />
              <input type="hidden" {...register('answers.2.question_key')} value="partner_not_kinky" />
            </div>
          </div>
        )}
        {gender !== 'femme' && gender !== 'homme' && (
          <p className="text-gray-500 text-sm">Selectionnez un genre pour afficher les questions.</p>
        )}
      </div>

      {/* Section: Centres d'interet */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4 pb-2 border-b">
          <h2 className="text-lg font-bold">Centres d&apos;interet</h2>
          <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
            selectedInterests.length >= 3 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {selectedInterests.length} selectionne{selectedInterests.length > 1 ? 's' : ''}
          </span>
        </div>
        {Object.entries(interestsByCategory).map(([category, categoryInterests]) => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {categoryInterests.map(interest => (
                <label key={interest.id} className="cursor-pointer">
                  <input
                    type="checkbox"
                    value={interest.id}
                    {...register('interests')}
                    className="hidden peer"
                  />
                  <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 border-gray-200 text-gray-600 hover:bg-gray-50">
                    {interest.icon} {interest.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Section: Photos & Description */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 pb-2 border-b">Photos & Description</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos * <span className="text-gray-400 font-normal">(la premiere sera la photo de profil)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files) {
                setPhotos(prev => [...prev, ...Array.from(e.target.files!)]);
              }
            }}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
          >
            <p className="text-sm font-medium text-gray-700">Cliquez pour ajouter des photos</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG ou WebP</p>
          </button>

          {photos.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {photos.map((photo, i) => (
                <div key={i} className="relative group">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Photo ${i + 1}`}
                    className={`w-20 h-20 rounded-lg object-cover ${i === 0 ? 'ring-2 ring-blue-500' : ''}`}
                  />
                  {i === 0 && (
                    <span className="absolute -top-1 -left-1 bg-blue-500 text-white text-[10px] font-bold px-1 rounded">PP</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description * <span className="text-gray-400 font-normal">({description.length}/500)</span>
          </label>
          <textarea
            {...register('description', {
              required: 'Description requise',
              minLength: { value: 50, message: 'Min 50 caracteres' },
              maxLength: { value: 500, message: 'Max 500 caracteres' },
            })}
            rows={4}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Bio de la personne..."
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {/* Section: Options admin */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold mb-4 pb-2 border-b">Options admin</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('auto_validate')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">Valider le profil immediatement</span>
              <p className="text-xs text-gray-400">Le profil sera visible dans le swipe des que cree</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" {...register('grant_premium')} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">Accorder le premium</span>
              <p className="text-xs text-gray-400">Messages illimites + super likes</p>
            </div>
          </label>

          {grantPremium && (
            <div className="ml-7">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duree du premium</label>
              <Controller
                name="premium_duration"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    {...field}
                    options={[
                      { value: '30', label: '30 jours' },
                      { value: '90', label: '90 jours' },
                      { value: '180', label: '180 jours' },
                      { value: '365', label: '1 an' },
                      { value: 'permanent', label: 'Permanent' },
                    ]}
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creation en cours...' : 'Creer le profil'}
        </button>
        <Link
          href="/admin/dating/profiles"
          className="bg-gray-100 text-gray-700 py-3 px-8 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}
