'use client';

import type { ChargingStation } from '@/lib/types';
import SearchForm from '@/components/voltsage/SearchForm';
import StationList from '@/components/voltsage/StationList';
import type { FilterOptions } from '@/app/page';
import { SidebarHeader, SidebarContent as SidebarBody, SidebarFooter } from "@/components/ui/sidebar";
import { Zap } from 'lucide-react';

interface SidebarContentProps {
  stations: ChargingStation[] | null;
  onSelectStation: (stationId: string | null) => void;
  isLoading: boolean;
  onSearch: (destination: string) => void;
  activeTab: 'nearby' | 'favorites';
  onTabChange: (tab: 'nearby' | 'favorites') => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  allConnectorTypes: string[];
  allNetworks: string[];
  selectedStationId: string | null;
}

export default function SidebarContent({
  stations,
  onSelectStation,
  isLoading,
  onSearch,
  activeTab,
  onTabChange,
  filters,
  onFiltersChange,
  allConnectorTypes,
  allNetworks,
  selectedStationId,
}: SidebarContentProps) {

  return (
    <div className="flex flex-col h-full bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-primary"/>
          <h2 className="text-2xl font-bold tracking-tight text-sidebar-foreground">Voltsage</h2>
        </div>
        <SearchForm onSearch={onSearch} isLoading={isLoading} />
      </SidebarHeader>
      <SidebarBody className="p-0">
          <StationList
            stations={stations}
            isLoading={isLoading}
            onSelectStation={onSelectStation}
            activeTab={activeTab}
            onTabChange={onTabChange}
            filters={filters}
            onFiltersChange={onFiltersChange}
            allConnectorTypes={allConnectorTypes}
            allNetworks={allNetworks}
            selectedStationId={selectedStationId}
          />
      </SidebarBody>
      <SidebarFooter className="p-2 text-center text-xs text-sidebar-foreground/60 border-t border-sidebar-border">
        <p>Data from OpenChargeMap.</p>
      </SidebarFooter>
    </div>
  );
}