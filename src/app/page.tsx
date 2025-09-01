'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { handleSearch } from '@/app/actions';
import type { ChargingStation } from '@/lib/types';
import Header from '@/components/voltsage/Header';
import SidebarContent from '@/components/voltsage/SidebarContent';
import { useFavorites } from '@/hooks/use-favorites';
import Image from 'next/image';

export type FilterOptions = {
  connectorTypes: string[];
  minSpeed: number;
};

export default function VoltsageApp() {
  const [stations, setStations] = useState<ChargingStation[] | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isListVisible, setIsListVisible] = useState(true);
  const { toast } = useToast();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'nearby' | 'favorites'>('nearby');
  
  const [filters, setFilters] = useState<FilterOptions>({
    connectorTypes: [],
    minSpeed: 0,
  });

  const handleSearchSubmit = useCallback(async (destination: string) => {
    if (!destination) return;
    
    setIsLoading(true);
    setSelectedStationId(null);
    setStations(null);
    setIsListVisible(true);
    
    const { chargingStations, error } = await handleSearch({ destination });

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: error,
      });
      setStations([]);
    } else {
      const stationsWithIds = chargingStations.map((station, index) => ({
        ...station,
        id: `${station.latitude}-${station.longitude}-${index}`,
      }));
      setStations(stationsWithIds);
      if (stationsWithIds.length === 0) {
        toast({
          title: 'No stations found',
          description: 'Try a different destination or broaden your search.',
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
            description: "Could not get your location. Please enter a destination manually.",
          });
          // Fallback to a default search 
          handleSearchSubmit("New York, NY");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation. Please enter a destination manually.",
      });
      // Fallback to a default search
      handleSearchSubmit("New York, NY");
    }
  }, [handleSearchSubmit, toast]);

  const handleSelectStation = useCallback((stationId: string | null) => {
    setSelectedStationId(stationId);
    setIsListVisible(false);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedStationId(null);
    setIsListVisible(true);
  }, []);

  const selectedStation = useMemo(
    () => stations?.find(s => s.id === selectedStationId) ?? null,
    [stations, selectedStationId]
  );
  
  const displayedStations = useMemo(() => {
    if (!stations) return null;
    let currentStations = activeTab === 'favorites'
      ? stations.filter(station => isFavorite(station.id))
      : stations;
    
    return currentStations.filter(station => {
      const connectorMatch = filters.connectorTypes.length === 0 || 
        filters.connectorTypes.some(ct => station.connectorTypes.includes(ct));
      
      let stationMaxPower = 0;
      if (station.speed.includes('DC Fast')) {
        stationMaxPower = 150; // Approximation
      } else if (station.speed.includes('Level 2')) {
        stationMaxPower = 7;
      }
      const speedMatch = stationMaxPower >= filters.minSpeed;
      
      return connectorMatch && speedMatch;
    });

  }, [stations, activeTab, isFavorite, filters]);

  const allConnectorTypes = useMemo(() => {
    if (!stations) return [];
    const allTypes = new Set<string>();
    stations.forEach(s => s.connectorTypes.forEach(ct => {
      if(ct && ct !== 'Unknown') allTypes.add(ct)
    }));
    return Array.from(allTypes);
  }, [stations]);

  return (
      <div className="relative flex h-dvh w-full flex-col bg-background font-sans">
        <Image
          src="https://picsum.photos/1920/1080"
          alt="Abstract background"
          fill
          quality={80}
          className="object-cover z-0"
          data-ai-hint="abstract background"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0" />

        <div className="relative z-10 flex flex-1 overflow-hidden p-4">
          <div className="flex w-full h-full max-h-full">
            
            {/* Sidebar */}
            <div className="w-full max-w-sm shrink-0 h-full">
              <div className="glass-card flex flex-col h-full">
                <SidebarContent
                  stations={displayedStations}
                  selectedStation={selectedStation}
                  isLoading={isLoading}
                  isListVisible={isListVisible}
                  onSearch={handleSearchSubmit}
                  onSelectStation={handleSelectStation}
                  onBackToList={handleBackToList}
                  isFavorite={isFavorite}
                  onToggleFavorite={toggleFavorite}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  filters={filters}
                  onFiltersChange={setFilters}
                  allConnectorTypes={allConnectorTypes}
                />
              </div>
            </div>

            {/* Main content placeholder */}
            <div className="flex-1 ml-4 h-full hidden md:flex">
              <div className="glass-card w-full h-full flex items-center justify-center">
                <Header />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
