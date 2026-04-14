'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane,
  faSpinner,
  faCircleCheck,
  faCircleExclamation,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/textarea';
import { CustomSelect } from '@/components/shared/CustomSelect';
import type { SelectOption } from '@/components/shared/CustomSelect';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const SUBJECT_OPTIONS: SelectOption[] = [
  { value: 'Question generale', label: 'Question generale' },
  { value: 'Signaler un bug', label: 'Signaler un bug' },
  { value: 'Demande de partenariat', label: 'Demande de partenariat' },
  { value: 'Autre', label: 'Autre' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm(state: FormState): string | null {
  if (state.name.trim().length < 2) return 'Le nom doit contenir au moins 2 caracteres.';
  if (!EMAIL_REGEX.test(state.email.trim())) return 'Adresse email invalide.';
  if (!state.subject) return 'Veuillez selectionner un sujet.';
  if (state.message.trim().length < 10) return 'Le message doit contenir au moins 10 caracteres.';
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<FormStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const formRef = useRef<HTMLDivElement>(null);

  const handleField = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const validationError = validateForm(form);
    if (validationError) {
      setErrorMessage(validationError);
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          subject: form.subject,
          message: form.message.trim(),
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setErrorMessage(data.error ?? 'Une erreur est survenue. Reessayez plus tard.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });

      // Scroll to top of form so success message is visible
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setErrorMessage('Erreur reseau. Verifiez votre connexion et reessayez.');
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  return (
    <main className="min-h-screen bg-muted/40">
      {/* Hero */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-14 text-center max-w-2xl">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-5">
            <FontAwesomeIcon icon={faEnvelope} className="text-primary text-xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Nous contacter
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Une question, un signalement ou une proposition ? Ecrivez-nous, nous repondons sous 48h.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="container mx-auto px-4 py-12 max-w-xl">
        <div ref={formRef}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              /* ---- Success state ---- */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-card rounded-2xl border border-border shadow-lg p-10 text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-green-500 text-3xl" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Message envoye !</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Merci de nous avoir contactes. Nous vous repondrons dans les plus brefs delais
                  (generalement sous 24-48h).
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStatus('idle')}
                  className="mt-2"
                >
                  Envoyer un autre message
                </Button>
              </motion.div>
            ) : (
              /* ---- Form ---- */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="bg-card rounded-2xl border border-border shadow-lg p-6 md:p-10"
              >
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Nom complet <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => handleField('name')(e.target.value)}
                      disabled={isLoading}
                      placeholder="Jean Dupont"
                      autoComplete="name"
                      className="w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors hover:border-primary/50 disabled:opacity-60"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Adresse email <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => handleField('email')(e.target.value)}
                      disabled={isLoading}
                      placeholder="jean@exemple.com"
                      autoComplete="email"
                      className="w-full rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors hover:border-primary/50 disabled:opacity-60"
                    />
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Sujet <span className="text-destructive">*</span>
                    </label>
                    <CustomSelect
                      options={SUBJECT_OPTIONS}
                      value={form.subject}
                      onChange={(value) => handleField('subject')(value as string)}
                      placeholder="Selectionnez un sujet..."
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block text-sm font-medium text-foreground mb-1"
                    >
                      Message <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => handleField('message')(e.target.value)}
                      disabled={isLoading}
                      placeholder="Decrivez votre demande..."
                      className="bg-muted/50 hover:border-primary/50 focus:bg-card resize-none"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {form.message.length} / 2000 caracteres
                    </p>
                  </div>

                  {/* Error message */}
                  <AnimatePresence>
                    {status === 'error' && errorMessage && (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-2.5 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm"
                      >
                        <FontAwesomeIcon
                          icon={faCircleExclamation}
                          className="mt-0.5 flex-shrink-0"
                        />
                        <span>{errorMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <div className="pt-1">
                    <motion.div whileHover={{ scale: isLoading ? 1 : 1.01 }} whileTap={{ scale: isLoading ? 1 : 0.99 }}>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        size="lg"
                        className="w-full font-semibold"
                      >
                        {isLoading ? (
                          <>
                            <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                            Envoi en cours...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                            Envoyer le message
                          </>
                        )}
                      </Button>
                    </motion.div>
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Nous repondons generalement sous 24-48h.
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
