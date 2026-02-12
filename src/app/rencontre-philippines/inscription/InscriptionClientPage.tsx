'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Settings2, MessageCircle, Heart, Camera, Shield, Check, Upload, ChevronRight, ChevronLeft, Sparkles, AlertCircle, Lock } from 'lucide-react';
import { Interest } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import { getInterests, checkExistingDatingProfile } from '@/services/datingService';
import { createDatingProfile } from './actions';
import { CustomSelect } from '@/components/shared/CustomSelect';
import { DATING_INTENT_OPTIONS, EDUCATION_OPTIONS, GENDER_OPTIONS, ORIENTATION_OPTIONS, RELIGION_OPTIONS, YES_NO_MAYBE_OPTIONS, FINANCIAL_STABILITY_OPTIONS, PARTNER_MOVE_OPTIONS, FOREINGNER_KINKY_OPTIONS, PARTNER_NOT_KINKY_OPTIONS, MONEY_IMPORTANCE_OPTIONS } from '@/config/dating';

const CitySelector = dynamic(() => import('@/components/shared/CitySelector'), { ssr: false });

const STEPS_CONFIG = [
  { number: 1, label: 'Profil', icon: User },
  { number: 2, label: 'Détails', icon: Settings2 },
  { number: 3, label: 'Questions', icon: MessageCircle },
  { number: 4, label: 'Passions', icon: Heart },
  { number: 5, label: 'Photo', icon: Camera },
  { number: 6, label: 'Charte', icon: Shield },
];

const STEP_HEADERS = [
  { title: 'Qui êtes-vous ?', subtitle: 'Les bases pour que les autres vous trouvent' },
  { title: 'Un peu plus sur vous', subtitle: 'Ces détails aident notre algorithme de compatibilité' },
  { title: 'Questions personnelles', subtitle: 'Vos réponses restent privées et guident notre matching' },
  { title: 'Vos centres d\'intérêt', subtitle: 'Sélectionnez au moins 3 passions' },
  { title: 'Présentez-vous', subtitle: 'Votre bio et votre photo, votre première impression' },
  { title: 'Charte de la communauté', subtitle: 'Un dernier pas pour rejoindre un espace bienveillant' },
];

const CHARTER_ITEMS = [
  { icon: Heart, title: 'Respect et Courtoisie', text: 'Traitez tous les membres avec respect et dignité. Aucune forme de harcèlement ou de discrimination ne sera tolérée.' },
  { icon: User, title: 'Authenticité', text: 'Présentez-vous de manière honnête. Les faux profils et l\'usurpation d\'identité sont strictement interdits.' },
  { icon: Shield, title: 'Contenu Approprié', text: 'Aucun contenu explicite, violent ou inapproprié. Les photos compromettantes entraînent un bannissement immédiat.' },
  { icon: AlertCircle, title: 'Usage Personnel', text: 'N\'utilisez pas ce service à des fins commerciales, de spam ou de promotion de services externes.' },
  { icon: Lock, title: 'Sécurité et Confidentialité', text: 'Protégez vos informations personnelles et respectez la vie privée des autres membres.' },
];

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    const fields: any = {
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
    setError(null);
    const currentFields = fields[step];
    const isValid = await trigger(currentFields);
    if (isValid) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prevStep = () => {
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const description = watch('description') || '';
  const selectedInterests = watch('interests') || [];

  return (
    <div className="min-h-screen bg-muted">
      {/* Hero header compact */}
      <section className="bg-card border-b border-border py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Rencontre Philippines
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Créez Votre Profil</h1>
          <p className="text-muted-foreground mt-2">Rejoignez notre communauté et trouvez votre moitié.</p>
        </div>
      </section>

      {/* Step indicator sticky */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto max-w-2xl py-4 px-4">
          <div className="flex items-center justify-center">
            {STEPS_CONFIG.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isComplete = step > s.number;
              return (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                        isComplete
                          ? 'bg-primary text-primary-foreground'
                          : isActive
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isComplete ? <Check className="w-4 h-4" /> : s.number}
                    </motion.div>
                    <span className={`hidden sm:block text-xs mt-1.5 ${
                      isActive ? 'text-primary font-medium' : isComplete ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS_CONFIG.length - 1 && (
                    <div className={`h-0.5 w-6 sm:w-10 mx-1 sm:mx-2 mb-5 sm:mb-0 ${
                      step > s.number ? 'bg-primary' : 'bg-border'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form area */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-2xl">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div>
              {/* Step 1 - Profil */}
              <div className={step === 1 ? 'block' : 'hidden'}>
                <motion.div
                  key={`step1-${step === 1}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{STEP_HEADERS[0].title}</h2>
                      <p className="text-sm text-muted-foreground">{STEP_HEADERS[0].subtitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Je suis</label>
                      <Controller
                        name="gender"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={GENDER_OPTIONS} />}
                      />
                      {errors.gender && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{String(errors.gender.message)}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Je recherche</label>
                      <Controller
                        name="orientation"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={ORIENTATION_OPTIONS} />}
                      />
                      {errors.orientation && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{String(errors.orientation.message)}
                        </motion.p>
                      )}
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-semibold text-foreground mb-2">Date de naissance</label>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Controller
                            name="day"
                            control={control}
                            rules={{ required: 'Jour requis' }}
                            render={({ field }) => <CustomSelect {...field} options={Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))} placeholder="Jour" />}
                          />
                          {errors.day && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />{String(errors.day.message)}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <Controller
                            name="month"
                            control={control}
                            rules={{ required: 'Mois requis' }}
                            render={({ field }) => <CustomSelect {...field} options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))} placeholder="Mois" />}
                          />
                          {errors.month && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />{String(errors.month.message)}
                            </motion.p>
                          )}
                        </div>
                        <div>
                          <Controller
                            name="year"
                            control={control}
                            rules={{ required: 'Année requise' }}
                            render={({ field }) => <CustomSelect {...field} options={Array.from({ length: 100 }, (_, i) => ({ value: new Date().getFullYear() - 18 - i, label: `${new Date().getFullYear() - 18 - i}` }))} placeholder="Année" />}
                          />
                          {errors.year && (
                            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" />{String(errors.year.message)}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Ville</label>
                      <Controller
                        name="city"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => (
                          <CitySelector value={field.value} onChange={field.onChange} />
                        )}
                      />
                      {errors.city && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{String(errors.city.message)}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border mt-8 pt-6 flex justify-end">
                    <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Step 2 - Détails */}
              <div className={step === 2 ? 'block' : 'hidden'}>
                <motion.div
                  key={`step2-${step === 2}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Settings2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{STEP_HEADERS[1].title}</h2>
                      <p className="text-sm text-muted-foreground">{STEP_HEADERS[1].subtitle}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Taille</label>
                      <Controller
                        name="height"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={Array.from({ length: 81 }, (_, i) => ({ value: i + 140, label: `${i + 140} cm` }))} />}
                      />
                      {errors.height && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{String(errors.height.message)}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Religion</label>
                      <Controller
                        name="religion"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={RELIGION_OPTIONS} />}
                      />
                      {errors.religion && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{String(errors.religion.message)}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Niveau d&apos;études</label>
                      <Controller
                        name="education"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={EDUCATION_OPTIONS} />}
                      />
                      {errors.education && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{String(errors.education.message)}
                        </motion.p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Profession</label>
                      <input
                        type="text"
                        {...register('occupation', { required: 'Ce champ est requis' })}
                        className="block w-full rounded-lg border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 transition-colors"
                      />
                      {errors.occupation && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{String(errors.occupation.message)}
                        </motion.p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-foreground mb-2">Que recherchez-vous ?</label>
                      <Controller
                        name="dating_intent"
                        control={control}
                        rules={{ required: 'Ce champ est requis' }}
                        render={({ field }) => <CustomSelect {...field} options={DATING_INTENT_OPTIONS} />}
                      />
                      {errors.dating_intent && (
                        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />{String(errors.dating_intent.message)}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border mt-8 pt-6 flex justify-between">
                    <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 bg-muted text-muted-foreground font-semibold py-3 px-6 rounded-lg hover:bg-muted/80 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                    <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Step 3 - Questions */}
              <div className={step === 3 ? 'block' : 'hidden'}>
                <motion.div
                  key={`step3-${step === 3}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{STEP_HEADERS[2].title}</h2>
                      <p className="text-sm text-muted-foreground">{STEP_HEADERS[2].subtitle}</p>
                    </div>
                  </div>

                  {watch('gender') === 'femme' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Seriez-vous ouverte à l&apos;idée de vous installer à l&apos;étranger pour une nouvelle aventure de vie ?</label>
                        <Controller name="answers.0.answer" control={control} render={({ field }) => <CustomSelect {...field} options={YES_NO_MAYBE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.0.question_key')} value="foreign_country" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Quelle importance accordez-vous à la sécurité financière dans une relation ?</label>
                        <Controller name="answers.1.answer" control={control} render={({ field }) => <CustomSelect {...field} options={MONEY_IMPORTANCE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.1.question_key')} value="money_importance" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Comment décririez-vous votre approche de l&apos;intimité dans une relation ?</label>
                        <Controller name="answers.2.answer" control={control} render={({ field }) => <CustomSelect {...field} options={FOREINGNER_KINKY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.2.question_key')} value="foreigner_kinky" />
                      </div>
                    </div>
                  )}
                  {watch('gender') === 'homme' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Seriez-vous prêt à accueillir votre partenaire dans votre pays si elle le souhaitait ?</label>
                        <Controller name="answers.0.answer" control={control} render={({ field }) => <CustomSelect {...field} options={PARTNER_MOVE_OPTIONS} />} />
                        <input type="hidden" {...register('answers.0.question_key')} value="partner_move" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">Quelle est votre perspective sur le soutien financier dans un couple où les situations économiques sont différentes ?</label>
                        <Controller name="answers.1.answer" control={control} render={({ field }) => <CustomSelect {...field} options={FINANCIAL_STABILITY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.1.question_key')} value="financial_stability" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">L&apos;harmonie et la douceur dans l&apos;intimité sont-elles plus importantes pour vous que l&apos;expérimentation ?</label>
                        <Controller name="answers.2.answer" control={control} render={({ field }) => <CustomSelect {...field} options={PARTNER_NOT_KINKY_OPTIONS} />} />
                        <input type="hidden" {...register('answers.2.question_key')} value="partner_not_kinky" />
                      </div>
                    </div>
                  )}

                  <div className="border-t border-border mt-8 pt-6 flex justify-between">
                    <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 bg-muted text-muted-foreground font-semibold py-3 px-6 rounded-lg hover:bg-muted/80 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                    <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Step 4 - Passions */}
              <div className={step === 4 ? 'block' : 'hidden'}>
                <motion.div
                  key={`step4-${step === 4}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">{STEP_HEADERS[3].title}</h2>
                        <p className="text-sm text-muted-foreground">{STEP_HEADERS[3].subtitle}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                      selectedInterests.length >= 3
                        ? 'bg-green-100 text-green-700'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {selectedInterests.length} / 3 min
                    </span>
                  </div>

                  {Object.entries(interests.reduce((acc, interest) => {
                    const category = interest.category || 'Autres';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(interest);
                    return acc;
                  }, {} as Record<string, Interest[]>)).map(([category, categoryInterests]) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categoryInterests.map(interest => (
                          <motion.label
                            key={interest.id}
                            whileTap={{ scale: 0.95 }}
                            htmlFor={`interest-${interest.id}`}
                            className="relative cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              id={`interest-${interest.id}`}
                              value={interest.id}
                              {...register('interests', { validate: value => value.length >= 3 || 'Veuillez sélectionner au moins 3 centres d\'intérêt' })}
                              className="hidden peer"
                            />
                            <span className="inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2.5 text-sm transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary peer-checked:shadow-sm peer-checked:shadow-primary/10 border-border text-muted-foreground hover:text-foreground hover:bg-muted">
                              {interest.icon} {interest.name}
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: selectedInterests.includes(String(interest.id)) ? 1 : 0 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </motion.span>
                            </span>
                          </motion.label>
                        ))}
                      </div>
                    </div>
                  ))}
                  {errors.interests && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />{String(errors.interests.message)}
                    </motion.p>
                  )}

                  <div className="border-t border-border mt-8 pt-6 flex justify-between">
                    <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 bg-muted text-muted-foreground font-semibold py-3 px-6 rounded-lg hover:bg-muted/80 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                    <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Step 5 - Photo & Bio */}
              <div className={step === 5 ? 'block' : 'hidden'}>
                <motion.div
                  key={`step5-${step === 5}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{STEP_HEADERS[4].title}</h2>
                      <p className="text-sm text-muted-foreground">{STEP_HEADERS[4].subtitle}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-foreground mb-2">Présentez-vous en quelques mots</label>
                    <div className="relative">
                      <textarea
                        {...register('description', {
                          required: 'Ce champ est requis',
                          minLength: { value: 100, message: 'La description doit contenir au moins 100 caractères' },
                          maxLength: { value: 500, message: 'La description ne peut pas dépasser 500 caractères' },
                        })}
                        rows={5}
                        className="block w-full rounded-xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 resize-none transition-colors"
                        placeholder="Soyez honnête et authentique. C'est le meilleur moyen de trouver quelqu'un qui vous correspond vraiment."
                      />
                      <span className={`absolute bottom-3 right-3 text-xs ${
                        description.length > 450
                          ? 'text-destructive'
                          : description.length < 100
                          ? 'text-muted-foreground'
                          : 'text-muted-foreground'
                      }`}>
                        {description.length}/500
                      </span>
                    </div>
                    {errors.description && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-destructive text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />{String(errors.description.message)}
                      </motion.p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-foreground mb-2">Photo de profil (obligatoire)</label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                    >
                      {photo ? (
                        <div className="flex flex-col items-center gap-3">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt="Preview"
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/20"
                          />
                          <div>
                            <p className="text-sm font-medium text-foreground">{photo.name}</p>
                            <p className="text-xs text-muted-foreground">Cliquez pour changer</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">Cliquez pour ajouter votre photo</p>
                            <p className="text-xs text-muted-foreground">JPG, PNG ou WebP</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-border mt-8 pt-6 flex justify-between">
                    <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 bg-muted text-muted-foreground font-semibold py-3 px-6 rounded-lg hover:bg-muted/80 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                    <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
                      Suivant <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Step 6 - Charte */}
              <div className={step === 6 ? 'block' : 'hidden'}>
                <motion.div
                  key={`step6-${step === 6}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="bg-card rounded-2xl shadow-lg border border-border p-6 sm:p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{STEP_HEADERS[5].title}</h2>
                      <p className="text-sm text-muted-foreground">{STEP_HEADERS[5].subtitle}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {CHARTER_ITEMS.map((item, i) => {
                      const ItemIcon = item.icon;
                      return (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/50 border border-border">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <ItemIcon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-foreground">{item.title}</h4>
                            <p className="text-sm text-muted-foreground mt-0.5">{item.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-muted-foreground mb-4">
                    Tout manquement à ces règles pourra entraîner une suspension temporaire ou un bannissement définitif de votre compte.
                  </p>

                  <label className="flex items-center gap-3 border-2 border-border rounded-xl p-4 cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-colors">
                    <input
                      type="checkbox"
                      {...register('charter_signed_at')}
                      required
                      className="peer h-5 w-5 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-foreground">Je comprends et j&apos;accepte la charte d&apos;engagement.</span>
                  </label>

                  <div className="border-t border-border mt-8 pt-6 flex justify-between">
                    <button type="button" onClick={prevStep} className="inline-flex items-center gap-2 bg-muted text-muted-foreground font-semibold py-3 px-6 rounded-lg hover:bg-muted/80 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Précédent
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {isLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          Création en cours...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Valider mon profil
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Global error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mt-6 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default InscriptionClientPage;
