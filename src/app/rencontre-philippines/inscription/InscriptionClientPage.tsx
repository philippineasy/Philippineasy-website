'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Interest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import { getInterests, checkExistingDatingProfile } from '@/services/datingService';
import { createDatingProfile } from './actions';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import { DATING_INTENT_OPTIONS, EDUCATION_OPTIONS, GENDER_OPTIONS, ORIENTATION_OPTIONS, RELIGION_OPTIONS, YES_NO_MAYBE_OPTIONS, FINANCIAL_STABILITY_OPTIONS, PARTNER_MOVE_OPTIONS, FOREINGNER_KINKY_OPTIONS, PARTNER_NOT_KINKY_OPTIONS, MONEY_IMPORTANCE_OPTIONS } from '@/config/dating';

const CitySelector = dynamic(() => import('@/components/shared/CitySelector'), { ssr: false });

type FormValues = {
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
  photo: FileList | null;
  interests: string[];
  answers: { question_key: string; answer: string }[];
  charter_signed_at: boolean;
};

const InscriptionClientPage = () => {
  const [step, setStep] = useState(1);
  const { register, handleSubmit, watch, formState: { errors }, trigger, control } = useForm<FormValues>({
    defaultValues: {
      gender: '',
      orientation: '',
      day: '',
      month: '',
      year: '',
      city: '',
      height: '',
      religion: '',
      education: '',
      occupation: '',
      dating_intent: '',
      description: '',
      interests: [],
      answers: [
        { question_key: '', answer: '' },
        { question_key: '', answer: '' },
        { question_key: '', answer: '' },
      ],
      charter_signed_at: false,
    }
  });
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    const initializePage = async () => {
      if (user) {
        const hasProfile = await checkExistingDatingProfile(user.id);
        if (hasProfile) {
          router.push('/rencontre-philippines/en-attente');
          return;
        }
      }
      const fetchedInterests = await getInterests();
      setInterests(fetchedInterests);
    };
    initializePage();
  }, [user, router]);

  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    Object.keys(data).forEach(key => {
        if (key === 'interests' && Array.isArray(data[key])) {
            data[key].forEach((interestId: string) => {
                formData.append('interests', interestId);
            });
        } else if (key === 'answers' && Array.isArray(data[key])) {
            data[key].forEach((answer: any, index: number) => {
                Object.keys(answer).forEach(answerKey => {
                    formData.append(`answers.${index}.${answerKey}`, answer[answerKey]);
                });
            });
        } else {
            formData.append(key, data[key]);
        }
    });
    if (photo) {
        formData.append('photo', photo);
    }

    const result = await createDatingProfile(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const nextStep = async () => {
    const fields:any = {
      1: ['gender', 'orientation', 'day', 'month', 'year', 'city'],
      2: ['height', 'religion', 'education', 'occupation', 'dating_intent'],
      3: [],
      4: ['interests'],
      5: ['description', 'photo'],
    };
    if (step === 5 && !photo) {
      setError('Veuillez sélectionner une photo de profil.');
      return;
    }
    const currentFields = fields[step];
    const isValid = await trigger(currentFields);
    if (isValid) {
      setStep(s => s + 1);
    }
  };
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="relative min-h-screen">
      <video autoPlay loop muted className="absolute z-0 w-full h-full object-cover">
        <source src="/videos/Beach%20Philippines.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 min-h-screen bg-black/30 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">Créez Votre Profil</h1>
              <p className="text-gray-600 mt-2">Rejoignez notre communauté et trouvez votre moitié.</p>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-10 relative">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${(step / 6) * 100}%` }}
              ></div>
            </div>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <div className={step === 1 ? 'block' : 'hidden'}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-700">Informations de base</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Je suis</label>
                      <Controller
                        name="gender"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={GENDER_OPTIONS} />}
                      />
                      {errors.gender && <p className="text-red-500 text-sm mt-1">{String(errors.gender.message)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Je recherche</label>
                      <Controller
                        name="orientation"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={ORIENTATION_OPTIONS} />}
                      />
                      {errors.orientation && <p className="text-red-500 text-sm mt-1">{String(errors.orientation.message)}</p>}
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Controller
                            name="day"
                            control={control}
                            rules={{ required: 'Jour requis' }}
                            render={({ field }) => <CustomSelect {...field} options={Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))} placeholder="Jour" />}
                          />
                          {errors.day && <p className="text-red-500 text-sm mt-1">{String(errors.day.message)}</p>}
                        </div>
                        <div>
                           <Controller
                            name="month"
                            control={control}
                            rules={{ required: 'Mois requis' }}
                            render={({ field }) => <CustomSelect {...field} options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))} placeholder="Mois" />}
                          />
                          {errors.month && <p className="text-red-500 text-sm mt-1">{String(errors.month.message)}</p>}
                        </div>
                        <div>
                          <Controller
                            name="year"
                            control={control}
                            rules={{ required: 'Année requise' }}
                            render={({ field }) => <CustomSelect {...field} options={Array.from({ length: 100 }, (_, i) => ({ value: new Date().getFullYear() - 18 - i, label: `${new Date().getFullYear() - 18 - i}` }))} placeholder="Année" />}
                          />
                          {errors.year && <p className="text-red-500 text-sm mt-1">{String(errors.year.message)}</p>}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => (
                          <CitySelector
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{String(errors.city.message)}</p>}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button type="button" onClick={nextStep} className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105">Suivant</button>
                  </div>
                </div>
              </div>
              <div className={step === 2 ? 'block' : 'hidden'}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-700">Détails Personnels</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                       <Controller
                        name="height"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={Array.from({ length: 81 }, (_, i) => ({ value: i + 140, label: `${i + 140} cm` }))} />}
                      />
                      {errors.height && <p className="text-red-500 text-sm mt-1">{String(errors.height.message)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                      <Controller
                        name="religion"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={RELIGION_OPTIONS} />}
                      />
                      {errors.religion && <p className="text-red-500 text-sm mt-1">{String(errors.religion.message)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'études</label>
                      <Controller
                        name="education"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={EDUCATION_OPTIONS} />}
                      />
                      {errors.education && <p className="text-red-500 text-sm mt-1">{String(errors.education.message)}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                      <input type="text" {...register('occupation', { required: 'Ce champ est requis' })} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-3" />
                      {errors.occupation && <p className="text-red-500 text-sm mt-1">{String(errors.occupation.message)}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Que recherchez-vous ?</label>
                      <Controller
                        name="dating_intent"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={DATING_INTENT_OPTIONS} />}
                      />
                      {errors.dating_intent && <p className="text-red-500 text-sm mt-1">{String(errors.dating_intent.message)}</p>}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">Précédent</button>
                    <button type="button" onClick={nextStep} className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105">Suivant</button>
                  </div>
                </div>
              </div>
              <div className={step === 3 ? 'block' : 'hidden'}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-700">Questionnaire</h2>
                  {watch('gender') === 'Femme' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Seriez-vous ouverte à l'idée de vous installer à l'étranger pour une nouvelle aventure de vie ?</label>
                        <Controller name="answers.0.answer" control={control} render={({ field }) => <CustomSelect {...field} options={YES_NO_MAYBE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.0.question_key')} value="foreign_country" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quelle importance accordez-vous à la sécurité financière dans une relation ?</label>
                        <Controller name="answers.1.answer" control={control} render={({ field }) => <CustomSelect {...field} options={MONEY_IMPORTANCE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.1.question_key')} value="money_importance" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Comment décririez-vous votre approche de l'intimité dans une relation ?</label>
                        <Controller name="answers.2.answer" control={control} render={({ field }) => <CustomSelect {...field} options={FOREINGNER_KINKY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.2.question_key')} value="foreigner_kinky" />
                      </div>
                    </div>
                  )}
                  {watch('gender') === 'Homme' && (
                     <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Seriez-vous prêt à accueillir votre partenaire dans votre pays si elle le souhaitait ?</label>
                        <Controller name="answers.0.answer" control={control} render={({ field }) => <CustomSelect {...field} options={PARTNER_MOVE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.0.question_key')} value="partner_move" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Quelle est votre perspective sur le soutien financier dans un couple où les situations économiques sont différentes ?</label>
                        <Controller name="answers.1.answer" control={control} render={({ field }) => <CustomSelect {...field} options={FINANCIAL_STABILITY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.1.question_key')} value="financial_stability" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">L'harmonie et la douceur dans l'intimité sont-elles plus importantes pour vous que l'expérimentation ?</label>
                        <Controller name="answers.2.answer" control={control} render={({ field }) => <CustomSelect {...field} options={PARTNER_NOT_KINKY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.2.question_key')} value="partner_not_kinky" />
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between mt-8">
                    <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">Précédent</button>
                    <button type="button" onClick={nextStep} className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105">Suivant</button>
                  </div>
                </div>
              </div>
              <div className={step === 4 ? 'block' : 'hidden'}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-700">Vos centres d'intérêt</h2>
                  <p className="text-gray-600 mb-4">Sélectionnez au moins 3 centres d'intérêt pour nous aider à trouver les personnes qui vous correspondent le mieux.</p>
                  {Object.entries(interests.reduce((acc, interest) => {
                    const category = interest.category || 'Autres';
                    if (!acc[category]) {
                      acc[category] = [];
                    }
                    acc[category].push(interest);
                    return acc;
                  }, {} as Record<string, Interest[]>)).map(([category, interests]) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">{category}</h3>
                      <div className="flex flex-wrap gap-3">
                        {interests.map(interest => (
                          <div key={interest.id}>
                            <input type="checkbox" id={`interest-${interest.id}`} value={interest.id} {...register('interests', { validate: value => value.length >= 3 || 'Veuillez sélectionner au moins 3 centres d\'intérêt' })} className="hidden peer" />
                            <label htmlFor={`interest-${interest.id}`} className="inline-flex items-center justify-center w-full p-3 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary hover:text-gray-600 hover:bg-gray-50">                           
                              <div className="block">
                                <div className="w-full text-lg">{interest.icon} {interest.name}</div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between">
                    <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">Précédent</button>
                    <button type="button" onClick={nextStep} className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105">Suivant</button>
                  </div>
                </div>
              </div>
              <div className={step === 5 ? 'block' : 'hidden'}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-700">Présentez-vous</h2>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Présentez-vous en quelques mots</label>
                    <textarea {...register('description', { required: 'Ce champ est requis', minLength: { value: 100, message: 'La description doit contenir au moins 100 caractères' }, maxLength: { value: 500, message: 'La description ne peut pas dépasser 500 caractères' } })} rows={5} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-3" placeholder="Soyez honnête et authentique. C'est le meilleur moyen de trouver quelqu'un qui vous correspond vraiment." />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{String(errors.description.message)}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Photo de profil (obligatoire)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      {...register('photo', { required: 'Une photo est requise' })}
                      onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                  </div>
                  <div className="flex justify-between mt-8">
                    <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">Précédent</button>
                    <button type="button" onClick={nextStep} className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary/90 transition-transform transform hover:scale-105">Suivant</button>
                  </div>
                </div>
              </div>
              <div className={step === 6 ? 'block' : 'hidden'}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-gray-700">Charte d'engagement</h2>
                  <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50 p-4 rounded-lg border mb-6">
                    <p>En rejoignant notre communauté, vous vous engagez à maintenir un environnement sûr, respectueux et authentique. En acceptant cette charte, vous adhérez aux principes suivants :</p>
                    <ul>
                      <li><strong>Respect et Courtoisie :</strong> Traitez tous les membres avec respect, dignité et courtoisie. Aucune forme de harcèlement, de discours haineux, de discrimination ou d'intimidation ne sera tolérée.</li>
                      <li><strong>Authenticité :</strong> Présentez-vous de manière honnête et sincère. Les faux profils, l'usurpation d'identité et les informations trompeuses sont strictement interdits.</li>
                      <li><strong>Contenu Approprié :</strong> Ne publiez, ne partagez et n'envoyez aucun contenu à caractère sexuellement explicite, violent, illégal ou autrement inapproprié. La publication de photos compromettantes ou non sollicitées entraînera un bannissement immédiat.</li>
                      <li><strong>Pas d'Usage Commercial :</strong> N'utilisez pas ce service à des fins commerciales, de spam, de sollicitation ou de promotion de services externes.</li>
                      <li><strong>Sécurité et Confidentialité :</strong> Protégez vos informations personnelles et respectez la vie privée des autres. Ne partagez pas d'informations sensibles (numéro de téléphone, adresse, etc.) dans les conversations publiques.</li>
                    </ul>
                    <p>Tout manquement à ces règles pourra entraîner une suspension temporaire ou un bannissement définitif de votre compte, à la discrétion de notre équipe de modération.</p>
                  </div>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" {...register('charter_signed_at')} required className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-gray-700">Je comprends et j'accepte la charte d'engagement.</span>
                  </label>
                  <div className="flex justify-between mt-8">
                    <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-300 transition-colors">Précédent</button>
                    <button type="submit" disabled={isLoading} className="bg-green-500 text-white font-bold py-3 px-8 rounded-full hover:bg-green-600 transition-transform transform hover:scale-105 disabled:bg-gray-400">
                      {isLoading ? 'Création...' : 'Valider mon profil'}
                    </button>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscriptionClientPage;
