'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleSearch } from '@/app/actions';
import type { ChargingStation } from '@/lib/types';
import SidebarContent from '@/components/voltsage/SidebarContent';
import { useFavorites } from '@/hooks/use-favorites';
import { useRatings } from '@/hooks/use-ratings';

export type FilterOptions = {
  connectorTypes: string[];
  minPower: number;
  networks: string[];
  showAvailable: boolean;
};

export default function VoltsageApp() {
  const [stations, setStations] = useState<ChargingStation[] | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { ratings, setRating } = useRatings();
  const [activeTab, setActiveTab] = useState<'nearby' | 'favorites'>('nearby');
  
  const [filters, setFilters] = useState<FilterOptions>({
    connectorTypes: [],
    minPower: 0,
    networks: [],
    showAvailable: false,
  });

  const handleSearchSubmit = useCallback(async (destination: string) => {
    if (!destination) return;
    
    setIsLoading(true);
    setSelectedStationId(null);
    setStations(null);
    
    const { chargingStations, error } = await handleSearch({ destination });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: error,
      });
      setStations([]);
    } else {
      setStations(chargingStations);
      if (chargingStations.length === 0) {
        toast({
          title: 'No stations found',
          description: 'No stations found near that location. Try a different area.',
        });
      }
    }
    setIsLoading(false);
  }, [toast]);
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleSearchSubmit(`${latitude},${longitude}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            variant: "destructive",
            title: "Geolocation failed",
            description: "Could not get your location. Searching default location.",
          });
          handleSearchSubmit('37.7749,-122.4194'); // Default to San Francisco
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation. Searching default location.",
      });
      handleSearchSubmit('37.7749,-122.4194'); // Default to San Francisco
    }
  }, [handleSearchSubmit, toast]);

  const handleSelectStation = useCallback((stationId: string | null) => {
    setSelectedStationId(stationId);
  }, []);

  const selectedStation = useMemo(
    () => stations?.find(s => s.id === selectedStationId) ?? null,
    [stations, selectedStationId]
  );
  
  const allConnectorTypes = useMemo(() => {
    if (!stations) return [];
    const allTypes = new Set<string>();
    stations.forEach(s => s.connectors.forEach(c => allTypes.add(c.type)));
    return Array.from(allTypes);
  }, [stations]);

  const allNetworks = useMemo(() => {
    if (!stations) return [];
    const networks = new Set<string>();
    stations.forEach(s => {
      if(s.network && s.network !== 'Unknown') {
        networks.add(s.network)
      }
    });
    return Array.from(networks);
  }, [stations]);

  const displayedStations = useMemo(() => {
    if (!stations) return null;
    let currentStations = activeTab === 'favorites'
      ? stations.filter(station => isFavorite(station.id))
      : stations;
    
    return currentStations.filter(station => {
      const connectorMatch = filters.connectorTypes.length === 0 || 
        filters.connectorTypes.some(ct => station.connectors.some(c => c.type === ct));
      
      const stationMaxPower = Math.max(0, ...station.connectors.map(c => c.powerKw));
      const powerMatch = stationMaxPower >= filters.minPower;

      const networkMatch = filters.networks.length === 0 || filters.networks.includes(station.network);

      const availabilityMatch = !filters.showAvailable || station.availability.available > 0;
      
      return connectorMatch && powerMatch && networkMatch && availabilityMatch;
    });

  }, [stations, activeTab, isFavorite, filters]);

  return (
    <div className="flex h-dvh w-full justify-center items-center bg-gray-100 dark:bg-gray-900 bg-gradient-to-br from-primary/20 via-background to-background">
      <div className="w-full max-w-md h-full max-h-dvh bg-white/50 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-white/30">
          <SidebarContent
            stations={displayedStations}
            selectedStation={selectedStation}
            onSelectStation={handleSelectStation}
            isLoading={isLoading}
            onSearch={handleSearchSubmit}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            filters={filters}
            onFiltersChange={setFilters}
            allConnectorTypes={allConnectorTypes}
            allNetworks={allNetworks}
            ratings={ratings}
            onRate={setRating}
          />
      </div>
    </div>
  );
}
