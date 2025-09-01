'use client';

import { useState, useMemo, useCallback } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { handleSearch } from '@/app/actions';
import type { ChargingStation } from '@/lib/types';
import StationMap from '@/components/voltsage/StationMap';
import Header from '@/components/voltsage/Header';
import SidebarContent from '@/components/voltsage/SidebarContent';
import { useFavorites } from '@/hooks/use-favorites';
import dynamic from 'next/dynamic';

const DynamicStationMap = dynamic(() => import('@/components/voltsage/StationMap'), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-muted"><p>Loading Map...</p></div>
});


export default function VoltsageApp() {
  const [stations, setStations] = useState<ChargingStation[] | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListVisible, setIsListVisible] = useState(true);
  const { toast } = useToast();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSearchSubmit = async (destination: string) => {
    if (!destination) return;
    
    setIsLoading(true);
    setSelectedStationId(null);
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

  const handleSelectStation = useCallback((stationId: string | null) => {
    setSelectedStationId(stationId);
    if (stationId) {
      setIsListVisible(false);
    }
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
    if (showFavorites) {
      return stations.filter(station => isFavorite(station.id));
    }
    return stations;
  }, [stations, showFavorites, isFavorite]);

  return (
    <SidebarProvider>
      <div className="relative flex h-dvh w-full flex-col bg-background">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar>
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
              showFavorites={showFavorites}
              onToggleShowFavorites={() => setShowFavorites(prev => !prev)}
            />
          </Sidebar>
          <SidebarInset>
            <DynamicStationMap
              stations={filteredStations}
              selectedStation={selectedStation}
              onSelectStation={handleSelectStation}
            />
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
