'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ChargingStation } from '@/lib/types';
import SearchForm from '@/components/voltsage/SearchForm';
import StationList from '@/components/voltsage/StationList';
import StationDetails from '@/components/voltsage/StationDetails';
import type { FilterOptions } from '@/app/page';

interface SidebarContentProps {
  stations: ChargingStation[] | null;
  selectedStation: ChargingStation | null;
  onSelectStation: (stationId: string | null) => void;
  isLoading: boolean;
  onSearch: (destination: string) => void;
  activeTab: 'nearby' | 'favorites';
  onTabChange: (tab: 'nearby' | 'favorites') => void;
  isFavorite: (stationId: string) => boolean;
  onToggleFavorite: (stationId: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  allConnectorTypes: string[];
  allNetworks: string[];
  ratings: { [key: string]: number };
  onRate: (stationId: string, rating: number) => void;
}

export default function SidebarContent({
  stations,
  selectedStation,
  onSelectStation,
  isLoading,
  onSearch,
  activeTab,
  onTabChange,
  isFavorite,
  onToggleFavorite,
  filters,
  onFiltersChange,
  allConnectorTypes,
  allNetworks,
  ratings,
  onRate,
}: SidebarContentProps) {

  const animationVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20, position: 'absolute' },
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="p-4 border-b border-white/20">
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-center text-primary-foreground drop-shadow-md">Voltsage</h2>
        <SearchForm onSearch={onSearch} isLoading={isLoading} />
      </div>
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
            {selectedStation ? (
              <motion.div
                key="details"
                variants={animationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full w-full"
              >
                <StationDetails
                  station={selectedStation}
                  onBack={() => onSelectStation(null)}
                  isFavorite={isFavorite(selectedStation.id)}
                  onToggleFavorite={() => onToggleFavorite(selectedStation.id)}
                  rating={ratings[selectedStation.id] || 0}
                  onRate={(rating) => onRate(selectedStation.id, rating)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                variants={animationVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full w-full"
              >
                <StationList
                  stations={stations}
                  isLoading={isLoading}
                  onSelectStation={onSelectStation}
                  activeTab={activeTab}
                  onTabChange={onTabChange}
                  isFavorite={isFavorite}
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  allConnectorTypes={allConnectorTypes}
                  allNetworks={allNetworks}
                />
              </motion.div>
            )}
        </AnimatePresence>
      </div>
      <div className="p-2 text-center text-xs text-muted-foreground border-t border-white/20">
        <p>Data from OpenChargeMap. Use for informational purposes only.</p>
      </div>
    </div>
  );
}
