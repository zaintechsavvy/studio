'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { ChargingStation } from '@/lib/types';
import SearchForm from '@/components/voltsage/SearchForm';
import StationList from '@/components/voltsage/StationList';
import StationDetails from '@/components/voltsage/StationDetails';
import { useRatings } from '@/hooks/use-ratings';
import type { FilterOptions } from '@/app/page';

interface SidebarContentProps {
  stations: ChargingStation[] | null;
  selectedStation: ChargingStation | null;
  isLoading: boolean;
  isListVisible: boolean;
  activeTab: 'nearby' | 'favorites';
  onSearch: (destination: string) => void;
  onSelectStation: (stationId: string) => void;
  onBackToList: () => void;
  isFavorite: (stationId: string) => boolean;
  onToggleFavorite: (stationId: string) => void;
  onTabChange: (tab: 'nearby' | 'favorites') => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  allConnectorTypes: string[];
}

export default function SidebarContent({
  stations,
  selectedStation,
  isLoading,
  isListVisible,
  activeTab,
  onSearch,
  onSelectStation,
  onBackToList,
  isFavorite,
  onToggleFavorite,
  onTabChange,
  filters,
  onFiltersChange,
  allConnectorTypes,
}: SidebarContentProps) {
  const { ratings, setRating } = useRatings();

  const animationVariants = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  };
  
  const showDetailsInSidebar = isListVisible === false && !!selectedStation;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/20">
        <SearchForm onSearch={onSearch} isLoading={isLoading && !stations} />
      </div>
      <div className="flex-1 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {showDetailsInSidebar ? (
            <motion.div
              key="details"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full"
            >
              <StationDetails
                station={selectedStation}
                onBack={onBackToList}
                isFavorite={isFavorite(selectedStation.id)}
                onToggleFavorite={() => onToggleFavorite(selectedStation.id)}
                rating={ratings[selectedStation.id] || 0}
                onRate={(rating) => setRating(selectedStation.id, rating)}
                isPillVariant={true}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full"
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
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-2 text-center text-xs text-muted-foreground border-t border-white/20">
        <p>Powered by Voltsage</p>
      </div>
    </div>
  );
}
