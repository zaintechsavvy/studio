'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LoaderCircle, LocateFixed } from 'lucide-react';

interface SearchFormProps {
  onSearch: (destination: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (lat.trim() && lon.trim()) {
      onSearch(`${lat},${lon}`);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLon(position.coords.longitude.toString());
          onSearch(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Optionally, show a toast message to the user
        }
      );
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex w-full items-center gap-2">
        <Input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="h-12 text-base bg-white/60 focus:bg-white border-2 border-transparent focus:border-primary"
          disabled={isLoading}
        />
        <Input
          type="text"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          className="h-12 text-base bg-white/60 focus:bg-white border-2 border-transparent focus:border-primary"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !lat.trim() || !lon.trim()} size="icon" className="shrink-0 h-12 w-12 rounded-full">
          {isLoading ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
          <span className="sr-only">Search</span>
        </Button>
      </div>
      <Button type="button" variant="outline" onClick={handleGetCurrentLocation} className="w-full bg-white/60 border-2 border-transparent hover:border-primary hover:bg-white">
        <LocateFixed className="mr-2 h-4 w-4" />
        Use Current Location
      </Button>
    </form>
  );
}
