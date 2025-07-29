'use client';

import React, { useState, Fragment, useMemo } from 'react';
import { Interest } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CitySelector from '@/components/shared/CitySelector';
import { faFilter, faUndo, faChevronUp, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CustomSelect, SelectOption } from '@/components/shared/CustomSelect';
import { Disclosure, Transition } from '@headlessui/react';
import { GENDER_OPTIONS, RELIGION_OPTIONS, EDUCATION_OPTIONS, DATING_INTENT_OPTIONS } from '@/config/dating';
import { RangeSlider } from '@/components/shared/RangeSlider';

export interface DatingFilters {
  ageRange: { min: number; max: number };
  city: string;
  interests: number[];
  heightRange?: { min: number; max: number };
  religion?: string;
  education?: string;
  dating_intent?: string;
  gender?: string;
}

interface SwipeFiltersProps {
  onApplyFilters: (filters: DatingFilters) => void;
  availableInterests: Interest[];
}

const initialFiltersState: DatingFilters = {
  ageRange: { min: 18, max: 99 },
  city: '',
  interests: [],
  heightRange: { min: 140, max: 220 },
  religion: '',
  education: '',
  dating_intent: '',
  gender: '',
};

const AccordionItem = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Disclosure as="div" className="border-b border-border">
    {({ open }) => (
      <>
        <Disclosure.Button className="flex w-full justify-between rounded-lg px-4 py-3 text-left text-sm font-medium text-primary hover:bg-primary/5 focus:outline-none focus-visible:ring focus-visible:ring-primary/75">
          <span>{title}</span>
          <FontAwesomeIcon
            icon={faChevronUp}
            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-accent transition-transform`}
          />
        </Disclosure.Button>
        <Transition
          show={open}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Disclosure.Panel className="px-4 pb-4 pt-2 text-sm text-gray-500">
            {children}
          </Disclosure.Panel>
        </Transition>
      </>
    )}
  </Disclosure>
);

const SwipeFilters = ({ onApplyFilters, availableInterests }: SwipeFiltersProps) => {
  const [filters, setFilters] = useState<DatingFilters>(initialFiltersState);

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters(initialFiltersState);
    onApplyFilters(initialFiltersState);
  };

  const handleInterestChange = (e: React.ChangeEvent<HTMLInputElement>, interestId: number) => {
    e.stopPropagation();
    const isChecked = e.target.checked;
    setFilters(f => {
      const newInterests = isChecked
        ? [...f.interests, interestId]
        : f.interests.filter(i => i !== interestId);
      return { ...f, interests: newInterests };
    });
  };

  const removeFilter = (filterKey: keyof DatingFilters, value?: any) => {
    setFilters(f => {
      const newFilters = { ...f };
      switch (filterKey) {
        case 'gender':
        case 'city':
        case 'religion':
        case 'education':
        case 'dating_intent':
          (newFilters[filterKey] as any) = initialFiltersState[filterKey];
          break;
        case 'interests':
          newFilters.interests = newFilters.interests.filter(id => id !== value);
          break;
        case 'ageRange':
          newFilters.ageRange = initialFiltersState.ageRange;
          break;
        case 'heightRange':
          newFilters.heightRange = initialFiltersState.heightRange;
          break;
        default:
          break;
      }
      return newFilters;
    });
  };

  const activeFilters = useMemo(() => {
    const active: { key: string; value: string | undefined; id?: number }[] = [];
    if (filters.gender) active.push({ key: 'gender', value: GENDER_OPTIONS.find(o => o.value === filters.gender)?.label });
    if (filters.city) active.push({ key: 'city', value: filters.city });
    if (filters.religion) active.push({ key: 'religion', value: RELIGION_OPTIONS.find(o => o.value === filters.religion)?.label });
    if (filters.education) active.push({ key: 'education', value: EDUCATION_OPTIONS.find(o => o.value === filters.education)?.label });
    if (filters.dating_intent) active.push({ key: 'dating_intent', value: DATING_INTENT_OPTIONS.find(o => o.value === filters.dating_intent)?.label });
    if (filters.ageRange.min !== 18 || filters.ageRange.max !== 99) active.push({ key: 'ageRange', value: `Âge: ${filters.ageRange.min}-${filters.ageRange.max}` });
    if (filters.heightRange && (filters.heightRange.min !== 140 || filters.heightRange.max !== 220)) active.push({ key: 'heightRange', value: `Taille: ${filters.heightRange.min}-${filters.heightRange.max}cm` });
    filters.interests.forEach(id => {
      const interest = availableInterests.find(i => i.id === id);
      if (interest) active.push({ key: 'interests', value: interest.name, id: interest.id });
    });
    return active;
  }, [filters, availableInterests]);

  const labelClasses = "block text-sm font-medium text-foreground";

  return (
    <div className="bg-card p-4 rounded-lg shadow-lg flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-4 border-b border-border pb-3 flex items-center text-foreground">
        <FontAwesomeIcon icon={faFilter} className="text-primary mr-3" />
        Filtres
      </h3>

      {activeFilters.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2 text-foreground">Filtres actifs :</h4>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <div key={index} className="flex items-center bg-accent text-primary text-xs font-semibold px-2 py-1 rounded-full">
                <span>{filter.value}</span>
                <button onClick={() => removeFilter(filter.key as keyof DatingFilters, filter.id)} className="ml-2 text-primary hover:text-primary/70">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto space-y-1 -mx-4 px-4">
        <AccordionItem title="Informations générales">
            <div className="space-y-4 pt-2">
                <div>
                    <label className={labelClasses}>Genre</label>
                    <CustomSelect
                        options={GENDER_OPTIONS}
                        value={filters.gender}
                        onChange={value => setFilters(f => ({ ...f, gender: value as string }))}
                        placeholder="Tous les genres"
                    />
                </div>
                <div>
                    <label className={labelClasses}>
                        Tranche d'âge: <span className="font-bold text-primary">{filters.ageRange.min} - {filters.ageRange.max} ans</span>
                    </label>
                    <div className="flex space-x-4 mt-2" onMouseUp={handleApply} onTouchEnd={handleApply}>
                        <RangeSlider min="18" max="99" value={filters.ageRange.min} onChange={(e) => {
                            const newMin = parseInt(e.target.value);
                            if (newMin <= filters.ageRange.max) {
                                setFilters(f => ({ ...f, ageRange: { ...f.ageRange, min: newMin } }));
                            }
                        }} onMouseDown={e => e.stopPropagation()} />
                        <RangeSlider min="18" max="99" value={filters.ageRange.max} onChange={(e) => {
                            const newMax = parseInt(e.target.value);
                            if (newMax >= filters.ageRange.min) {
                                setFilters(f => ({ ...f, ageRange: { ...f.ageRange, max: newMax } }));
                            }
                        }} onMouseDown={e => e.stopPropagation()} />
                    </div>
                </div>
                <div>
                    <label htmlFor="city" className={labelClasses}>Ville</label>
                    <CitySelector
                        value={filters.city}
                        onChange={(value) => setFilters(f => ({ ...f, city: value || '' }))}
                    />
                </div>
            </div>
        </AccordionItem>

        <AccordionItem title="Physique">
            <div className="space-y-4 pt-2">
                <label className={labelClasses}>
                    Taille: <span className="font-bold text-primary">{filters.heightRange?.min} - {filters.heightRange?.max} cm</span>
                </label>
                <div className="flex space-x-4 mt-2" onMouseUp={handleApply} onTouchEnd={handleApply}>
                    <RangeSlider min="140" max="220" value={filters.heightRange?.min} onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        if (filters.heightRange && newMin <= filters.heightRange.max) {
                            setFilters(f => ({ ...f, heightRange: { ...f.heightRange!, min: newMin } }));
                        }
                    }} onMouseDown={e => e.stopPropagation()} />
                    <RangeSlider min="140" max="220" value={filters.heightRange?.max} onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        if (filters.heightRange && newMax >= filters.heightRange.min) {
                            setFilters(f => ({ ...f, heightRange: { ...f.heightRange!, max: newMax } }));
                        }
                    }} onMouseDown={e => e.stopPropagation()} />
                </div>
            </div>
        </AccordionItem>

        <AccordionItem title="Style de vie & Croyances">
            <div className="space-y-4 pt-2">
                <CustomSelect
                    options={RELIGION_OPTIONS}
                    value={filters.religion}
                    onChange={value => setFilters(f => ({ ...f, religion: value as string }))}
                    placeholder="Toutes religions"
                />
                <CustomSelect
                    options={EDUCATION_OPTIONS}
                    value={filters.education}
                    onChange={value => setFilters(f => ({ ...f, education: value as string }))}
                    placeholder="Tous niveaux d'études"
                />
                <CustomSelect
                    options={DATING_INTENT_OPTIONS}
                    value={filters.dating_intent}
                    onChange={value => setFilters(f => ({ ...f, dating_intent: value as string }))}
                    placeholder="Toutes intentions"
                />
            </div>
        </AccordionItem>

        <AccordionItem title="Centres d'intérêt">
          <div className="mt-2 max-h-60 overflow-y-auto pr-2">
            <div className="flex flex-wrap gap-2">
              {availableInterests.map(interest => {
                const isSelected = filters.interests.includes(interest.id);
                return (
                  <label key={interest.id} className="cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isSelected} 
                      onChange={(e) => handleInterestChange(e, interest.id)}
                      className="sr-only peer"
                    />
                    <div className={`flex items-center justify-center space-x-2 px-3 py-1.5 rounded-full border transition-colors text-sm
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-muted hover:bg-muted/80 text-muted-foreground border-border'}`
                    }>
                      {isSelected && <FontAwesomeIcon icon={faCheck} className="h-3 w-3" />}
                      <span className="whitespace-nowrap">{interest.icon} {interest.name}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </AccordionItem>
      </div>

      <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
        <button onClick={handleApply} className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 font-semibold transition-colors">
          Appliquer
        </button>
        <button onClick={handleReset} className="w-full sm:w-auto bg-muted text-muted-foreground py-2 px-4 rounded-md hover:bg-muted/80 font-semibold transition-colors flex items-center justify-center">
          <FontAwesomeIcon icon={faUndo} className="mr-2 h-4 w-4" />
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default SwipeFilters;
