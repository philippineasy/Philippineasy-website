'use client';

import React from 'react';
import AsyncSelect from 'react-select/async';
import { StylesConfig } from 'react-select';
import { City, State, Country } from 'country-state-city';

export interface CityOption {
  value: string;
  label: string;
  countryCode: string;
  stateCode: string;
  name: string;
}

interface CitySelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  country?: string; // Optional country code (e.g., 'PH') to limit cities
}

const CitySelector = ({ value, onChange, country }: CitySelectorProps) => {

  const formatOptionLabel = (city: any) => (
    <div>
      <span>{city.label}</span>
    </div>
  );

  const loadOptions = (inputValue: string, callback: (options: CityOption[]) => void) => {
    if (!inputValue || inputValue.length < 2) {
      callback([]);
      return;
    }

    setTimeout(() => {
      const allCities = (country ? City.getCitiesOfCountry(country) : City.getAllCities()) || [];
      
      const filteredCities = allCities
        .filter(city => city.name.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 50); // Limit results for performance

      const options: CityOption[] = filteredCities.map(city => {
        const state = State.getStateByCodeAndCountry(city.stateCode, city.countryCode);
        const countryInfo = Country.getCountryByCode(city.countryCode);
        return {
          value: `${city.name}, ${state?.name || ''}, ${countryInfo?.isoCode || ''}`,
          label: `${city.name}, ${state?.name || ''}, ${countryInfo?.name || ''}`,
          countryCode: city.countryCode,
          stateCode: city.stateCode,
          name: city.name,
        };
      });
      callback(options);
    }, 300); // Debounce to avoid too many requests
  };

  const customStyles: StylesConfig<CityOption, false> = {
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

  // Find the full option object for the current value to display it correctly
  const currentValue = value ? { label: value, value: value } as CityOption : null;

  return (
    <AsyncSelect
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions
      value={currentValue}
      onChange={(selected) => onChange(selected ? selected.value : null)}
      isClearable
      placeholder="Commencez à taper une ville..."
      styles={customStyles}
      noOptionsMessage={({ inputValue }) => 
        inputValue.length < 2 ? "Veuillez taper au moins 2 caractères" : "Aucune ville trouvée"
      }
      loadingMessage={() => "Recherche en cours..."}
    />
  );
};

export default CitySelector;
