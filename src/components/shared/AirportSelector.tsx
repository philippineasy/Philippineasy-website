'use client';

import React from 'react';
import Select from 'react-select';
import { StylesConfig } from 'react-select';

export interface AirportOption {
  value: string;
  label: string;
}

const philippineAirports: AirportOption[] = [
  { value: 'MNL', label: 'Manille - Ninoy Aquino International Airport (MNL)' },
  { value: 'CEB', label: 'Cebu - Mactan-Cebu International Airport (CEB)' },
  { value: 'DVO', label: 'Davao - Francisco Bangoy International Airport (DVO)' },
  { value: 'CRK', label: 'Clark - Clark International Airport (CRK)' },
  { value: 'PPS', label: 'Puerto Princesa - Puerto Princesa International Airport (PPS)' },
  { value: 'ENI', label: 'El Nido - El Nido Airport (ENI)' },
  { value: 'USU', label: 'Coron - Francisco B. Reyes Airport (USU)' },
  { value: 'KLO', label: 'Kalibo - Kalibo International Airport (KLO)' },
  { value: 'MPH', label: 'Caticlan - Godofredo P. Ramos Airport (MPH)' },
  { value: 'TAG', label: 'Panglao - Bohol-Panglao International Airport (TAG)' },
];

interface AirportSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

const AirportSelector = ({ value, onChange }: AirportSelectorProps) => {

  const customStyles: StylesConfig<AirportOption, false> = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'var(--background)',
      borderColor: 'var(--border)',
      borderRadius: '0.375rem', // rounded-md
      padding: '0.25rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: 'var(--primary)',
      },
    }),
    input: (provided) => ({
      ...provided,
      color: 'var(--foreground)',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'var(--card)',
      borderColor: 'var(--border)',
      borderRadius: '0.375rem',
      zIndex: 9999,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'hsl(var(--primary))' : state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--card))',
      color: state.isSelected ? 'hsl(var(--primary-foreground))' : state.isFocused ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))',
      '&:active': {
        backgroundColor: 'hsl(var(--primary))',
        color: 'hsl(var(--primary-foreground))',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'var(--foreground)',
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'var(--muted-foreground)',
    }),
  };

  const currentValue = philippineAirports.find(option => option.value === value) || null;

  return (
    <Select
      options={philippineAirports}
      value={currentValue}
      onChange={(selected) => onChange(selected ? selected.value : null)}
      isClearable
      placeholder="Sélectionnez un aéroport..."
      styles={customStyles}
      noOptionsMessage={() => "Aucun aéroport trouvé"}
    />
  );
};

export default AirportSelector;
