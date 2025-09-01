'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { SidebarHeader, SidebarContent as SidebarContentArea, SidebarFooter } from '@/components/ui/sidebar';
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
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <>
      <SidebarHeader>
        <SearchForm onSearch={onSearch} isLoading={isLoading} />
      </SidebarHeader>
      <SidebarContentArea className="p-0">
        <AnimatePresence mode="wait">
          {selectedStation ? (
            <motion.div
              key="details"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <StationDetails
                station={selectedStation}
                onBack={onBackToList}
                isFavorite={isFavorite(selectedStation.id)}
                onToggleFavorite={() => onToggleFavorite(selectedStation.id)}
                rating={ratings[selectedStation.id] || 0}
                onRate={(rating) => setRating(selectedStation.id, rating)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={animationVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
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
      </SidebarContentArea>
      <SidebarFooter>
        <p className="text-center text-xs text-muted-foreground">
          Powered by Voltsage
        </p>
      </SidebarFooter>
    </>
  );
}
