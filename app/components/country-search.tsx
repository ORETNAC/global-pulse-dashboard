'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

interface CountrySearchProperties {
  onSelect: (country: string) => void;
}

interface Country {
  name: string;
  code: string;
  flag: string;
}

export function CountrySearch({ onSelect }: CountrySearchProperties) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperReference = useRef<HTMLDivElement>(null);
  const dropdownReference = useRef<HTMLDivElement>(null);
  const itemReferences = useRef<(HTMLButtonElement | null)[]>([]);

  // Fetch all countries from our backend API
  const { data: countries, isLoading } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      const response = await fetch('/api/countries');
      if (!response.ok) throw new Error('Failed to fetch countries');
      return response.json();
    },
    staleTime: 60 * 60 * 1000, // Cache for 1 hour
  });

  // Filter countries based on search
  const filteredCountries = (countries || [])
    .filter((country) => country.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10); // Show max 10 results

  // Scroll highlighted item into view
  useEffect(() => {
    if (itemReferences.current[highlightedIndex]) {
      itemReferences.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [highlightedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperReference.current && !wrapperReference.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (countryName: string) => {
    setSearch(countryName);
    setIsOpen(false);
    setHighlightedIndex(0);
    onSelect(countryName);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key
    switch (event.key) {
    case 'Enter': {
      event.preventDefault();

      // If dropdown is open and has results, select highlighted item
      if (isOpen && filteredCountries.length > 0 && filteredCountries[highlightedIndex]) {
        handleSelect(filteredCountries[highlightedIndex].name);
      }
      // If there's exactly one match, select it
      else if (filteredCountries.length === 1 && filteredCountries[0]) {
        handleSelect(filteredCountries[0].name);
      }
      // If search matches exactly, select it
      else if (search.trim()) {
        const exactMatch = countries?.find(
          (c) => c.name.toLowerCase() === search.trim().toLowerCase()
        );
        if (exactMatch) {
          handleSelect(exactMatch.name);
        }
      }
    
    break;
    }
    case 'ArrowDown': {
      event.preventDefault();
      setIsOpen(true);
      if (filteredCountries.length > 0) {
        setHighlightedIndex((previous) =>
          previous < filteredCountries.length - 1 ? previous + 1 : previous
        );
      }
    
    break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      if (filteredCountries.length > 0) {
        setHighlightedIndex((previous) => (previous > 0 ? previous - 1 : 0));
      }
    
    break;
    }
    case 'Escape': {
      setIsOpen(false);
      setHighlightedIndex(0);
    
    break;
    }
    // No default
    }
  };

  return (
    <div ref={wrapperReference} className="w-full max-w-md relative">
      <label htmlFor="country-search" className="block text-sm font-medium text-gray-700 mb-2">
        Search for a country
      </label>

      <div className="relative">
        <input
          id="country-search"
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Type a country name..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Dropdown */}
        {isOpen && search.length > 0 && filteredCountries.length > 0 && !isLoading && (
          <div
            ref={dropdownReference}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-auto"
          >
            {filteredCountries.map((country, index) => (
              <button
                key={country.code}
                ref={(element) => {
                  itemReferences.current[index] = element;
                }}
                onClick={() => handleSelect(country.name)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-4 py-3 text-left focus:outline-none flex items-center gap-3 transition-colors ${
                  index === highlightedIndex ? 'bg-blue-100' : 'hover:bg-blue-50'
                }`}
              >
                <img
                  src={country.flag}
                  alt={`Flag of ${country.name}`}
                  className="w-6 h-4 object-cover rounded"
                />
                <span className="text-gray-900">{country.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {isOpen && search.length > 0 && filteredCountries.length === 0 && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
            <p className="text-sm text-gray-500">
              No matches found for &ldquo;{search}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Popular countries quick select */}
      <div className="mt-4">
        <p className="text-sm text-gray-600 mb-2">Popular countries:</p>
        <div className="flex flex-wrap gap-2">
          {['Japan', 'United States', 'Brazil', 'France', 'Germany', 'Australia'].map(
            (country) => (
              <button
                key={country}
                onClick={() => handleSelect(country)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {country}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
