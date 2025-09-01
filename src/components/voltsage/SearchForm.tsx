'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LoaderCircle, MapPin } from 'lucide-react';

interface SearchFormProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [destination, setDestination] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (destination.trim()) {
      onSearch(destination);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-3">
      <div className="relative flex-grow">
        <MapPin className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter city or address..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="pl-11 h-12 text-base bg-white/60 focus:bg-white border-2 border-transparent focus:border-primary"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading || !destination.trim()} size="icon" className="shrink-0 h-12 w-12 rounded-full">
        {isLoading ? (
          <LoaderCircle className="h-5 w-5 animate-spin" />
        ) : (
          <Search className="h-5 w-5" />
        )}
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
