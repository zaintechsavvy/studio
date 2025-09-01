'use client';

import { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LoaderCircle, Waypoints } from 'lucide-react';

interface SearchFormProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [destination, setDestination] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(destination);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <div className="relative flex-grow">
        <Waypoints className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter a destination..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="pl-9"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" disabled={isLoading} size="icon" className="shrink-0">
        {isLoading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
