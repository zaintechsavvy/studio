'use client';

import type { ChargingStation } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import StationListItem from './StationListItem';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { FilterOptions } from '@/app/page';

interface StationListProps {
  stations: ChargingStation[] | null;
  isLoading: boolean;
  onSelectStation: (stationId: string) => void;
  activeTab: 'nearby' | 'favorites';
  onTabChange: (tab: 'nearby' | 'favorites') => void;
  isFavorite: (stationId: string) => boolean;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  allConnectorTypes: string[];
}

const ListSkeleton = () => (
  <div className="space-y-3 p-4">
    {Array.from({ length: 7 }).map((_, i) => (
      <Skeleton key={i} className="h-24 w-full rounded-xl bg-white/50" />
    ))}
  </div>
);

export default function StationList({
  stations,
  isLoading,
  onSelectStation,
  activeTab,
  onTabChange,
  isFavorite,
  filters,
  onFiltersChange,
  allConnectorTypes
}: StationListProps) {
  
  const handleConnectorChange = (connector: string) => {
    onFiltersChange({
      ...filters,
      connectorTypes: filters.connectorTypes.includes(connector)
        ? filters.connectorTypes.filter(c => c !== connector)
        : [...filters.connectorTypes, connector]
    });
  };

  const handleSpeedChange = (value: number[]) => {
    onFiltersChange({ ...filters, minSpeed: value[0] });
  };

  const renderStationList = (list: ChargingStation[] | null, emptyTitle: string, emptyDescription: string) => {
    if (!list || list.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="glass-card p-8">
            <h3 className="text-lg font-semibold">{emptyTitle}</h3>
            <p className="text-sm text-muted-foreground">{emptyDescription}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-3 p-4">
        {list.map(station => (
          <StationListItem
            key={station.id}
            station={station}
            onSelectStation={onSelectStation}
            isFavorite={isFavorite(station.id)}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
       <div className="p-4">
         <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'nearby' | 'favorites')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/40 h-12 rounded-xl">
              <TabsTrigger value="nearby" className="h-full rounded-lg text-base data-[state=active]:bg-white data-[state=active]:shadow-lg">Nearby</TabsTrigger>
              <TabsTrigger value="favorites" className="h-full rounded-lg text-base data-[state=active]:bg-white data-[state=active]:shadow-lg">Favorites</TabsTrigger>
            </TabsList>
         </Tabs>
       </div>

       <Collapsible className="border-y border-white/20 px-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-14 text-base">
              <span className="flex items-center gap-2 font-semibold">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="py-4 space-y-6">
            <div>
              <h4 className="font-semibold mb-3 text-base">Connector Type</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {allConnectorTypes.map(connector => (
                <div key={connector} className="flex items-center space-x-3">
                  <Checkbox 
                    id={connector} 
                    className="h-5 w-5"
                    checked={filters.connectorTypes.includes(connector)}
                    onCheckedChange={() => handleConnectorChange(connector)}
                  />
                  <Label htmlFor={connector} className="text-base">{connector}</Label>
                </div>
              ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-base">Minimum Speed</h4>
              <div className="flex items-center gap-4">
                <Slider
                  min={0}
                  max={350}
                  step={50}
                  value={[filters.minSpeed]}
                  onValueChange={handleSpeedChange}
                />
                <span className="font-semibold w-24 text-right text-base">{filters.minSpeed} kW</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      
      <ScrollArea className="flex-1">
        {isLoading ? (
           <ListSkeleton />
        ) : (
          activeTab === 'nearby'
            ? renderStationList(stations, 'No Nearby Stations', 'Try adjusting filters or searching a new area.')
            : renderStationList(stations, 'No Favorites Yet', 'Save stations to see them here.')
        )}
      </ScrollArea>
    </div>
  );
}
