'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { handleSearch } from '@/app/actions';
import type { ChargingStation } from '@/lib/types';
import Header from '@/components/voltsage/Header';
import SidebarContent from '@/components/voltsage/SidebarContent';
import { useFavorites } from '@/hooks/use-favorites';

export type FilterOptions = {
  connectorTypes: string[];
  minSpeed: number;
};

export default function VoltsageApp() {
  const [stations, setStations] = useState<ChargingStation[] | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListVisible, setIsListVisible] = useState(true);
  const { toast } = useToast();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'nearby' | 'favorites'>('nearby');
  
  const [filters, setFilters] = useState<FilterOptions>({
    connectorTypes: [],
    minSpeed: 0,
  });

  const handleSearchSubmit = async (destination: string) => {
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
      setStations(null);
    } else {
      const stationsWithIds = chargingStations.map((station, index) => ({
        ...station,
        id: `${station.name}-${station.latitude}-${station.longitude}`,
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
  };
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleSearchSubmit(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            variant: "destructive",
            title: "Geolocation failed",
            description: "Could not get your location. Please enter a destination manually.",
          });
          // Fallback to a default search or let user search manually
          if (!stations) {
            handleSearchSubmit("New York, NY");
          }
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation. Please enter a destination manually.",
      });
      // Fallback to a default search
       if (!stations) {
          handleSearchSubmit("New York, NY");
       }
    }
  }, []); // Run once on component mount

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
  
  const filteredStations = useMemo(() => {
    if (!stations) return null;
    let currentStations = stations;

    if (activeTab === 'favorites') {
      currentStations = stations.filter(station => isFavorite(station.id));
    }
    
    return currentStations.filter(station => {
      const connectorMatch = filters.connectorTypes.length === 0 || 
        filters.connectorTypes.some(ct => station.connectorTypes.includes(ct));
      
      const stationSpeed = parseInt(station.speed.replace('kW', ''));
      const speedMatch = isNaN(stationSpeed) || stationSpeed >= filters.minSpeed;
      
      return connectorMatch && speedMatch;
    });

  }, [stations, activeTab, isFavorite, filters]);

  const allConnectorTypes = useMemo(() => {
    if (!stations) return [];
    const allTypes = new Set<string>();
    stations.forEach(s => s.connectorTypes.forEach(ct => allTypes.add(ct)));
    return Array.from(allTypes);
  }, [stations]);

  return (
    <SidebarProvider>
      <div className="relative flex h-dvh w-full flex-col bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <div className="mx-auto w-full max-w-md border-x">
             <SidebarContent
              stations={filteredStations}
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
      </div>
    </SidebarProvider>
  );
}
