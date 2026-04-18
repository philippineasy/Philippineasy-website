'use client';

import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { fadeInUp, staggerContainer } from './animations';

const STEPS = [
  {
    number: 1,
    title: 'Decrivez votre voyage',
    description: 'Remplissez le formulaire (2 min)',
    tag: 'GRATUIT',
    tagColor: 'text-green-600',
  },
  {
    number: 2,
    title: 'Recevez 3 propositions',
    description: 'Notre IA cree 3 itineraires adaptes',
    tag: 'GRATUIT',
    tagColor: 'text-green-600',
  },
  {
    number: 3,
    title: 'Debloquez le complet',
    description: 'Programme detaille, liens, conseils',
    tag: 'DES 9,99€',
    tagColor: 'text-primary',
  },
] as const;

export function HowItWorks() {
  return (
    <div
      className="bg-card rounded-2xl p-6 md:p-8 mb-12 max-w-4xl mx-auto"
      style={{ border: '0.5px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
    >
      <h2
        className="text-foreground mb-6 flex items-center gap-2"
        style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.01em' }}
      >
        <FontAwesomeIcon icon={faCircleInfo} className="text-primary" />
        Comment ça marche ?
      </h2>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-50px' }}
      >
        {/* Connecting line (desktop only) */}
        <div className="hidden md:block absolute top-6 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px border-t-2 border-dashed border-primary/20" />

        {STEPS.map((step) => (
          <motion.div key={step.number} variants={fadeInUp} className="text-center relative">
            <div className="w-14 h-14 bg-primary/10 ring-1 ring-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-primary">{step.number}</span>
            </div>
            <h3 className="font-semibold mb-1">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
            <p className={`text-xs font-medium mt-1 ${step.tagColor}`}>{step.tag}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
