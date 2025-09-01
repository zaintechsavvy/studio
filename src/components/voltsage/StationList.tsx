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
import { SlidersHorizontal } from 'lucide-react';
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
  allNetworks: string[];
}

const ListSkeleton = () => (
  <div className="space-y-3 p-4">
    {Array.from({ length: 7 }).map((_, i) => (
      <Skeleton key={i} className="h-28 w-full rounded-xl bg-gray-200" />
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
  allConnectorTypes,
  allNetworks
}: StationListProps) {
  
  const handleConnectorChange = (connector: string) => {
    onFiltersChange({
      ...filters,
      connectorTypes: filters.connectorTypes.includes(connector)
        ? filters.connectorTypes.filter(c => c !== connector)
        : [...filters.connectorTypes, connector]
    });
  };

  const handleNetworkChange = (network: string) => {
    onFiltersChange({
      ...filters,
      networks: filters.networks.includes(network)
        ? filters.networks.filter(n => n !== network)
        : [...filters.networks, network]
    });
  };

  const handlePowerChange = (value: number[]) => {
    onFiltersChange({ ...filters, minPower: value[0] });
  };
  
  const handleAvailabilityChange = (checked: boolean) => {
    onFiltersChange({ ...filters, showAvailable: checked });
  }

  const renderStationList = (list: ChargingStation[] | null) => {
    if (!list || list.length === 0) {
      const emptyTitle = activeTab === 'favorites' ? 'No Favorites Yet' : 'No Stations Found';
      const emptyDescription = activeTab === 'favorites' 
        ? 'Save stations to see them here.'
        : 'Try adjusting filters or searching a new area.';

      return (
        <div className="flex h-full flex-col items-center justify-center p-8 text-center">
          <div className="p-8">
            <h3 className="text-lg font-semibold">{emptyTitle}</h3>
            <p className="text-sm text-muted-foreground">{emptyDescription}</p>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-2 p-2">
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
       <div className="p-4 border-b border-border">
         <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'nearby' | 'favorites')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100 h-11 rounded-lg">
              <TabsTrigger value="nearby" className="h-full rounded-md text-base data-[state=active]:bg-white data-[state=active]:shadow-sm">Nearby</TabsTrigger>
              <TabsTrigger value="favorites" className="h-full rounded-md text-base data-[state=active]:bg-white data-[state=active]:shadow-sm">Favorites</TabsTrigger>
            </TabsList>
         </Tabs>
       </div>

       <Collapsible className="border-b border-border">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-14 text-base px-4">
              <span className="flex items-center gap-2 font-semibold">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="py-4 px-4 space-y-6">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="show-available" 
                className="h-5 w-5"
                checked={filters.showAvailable}
                onCheckedChange={handleAvailabilityChange}
              />
              <Label htmlFor="show-available" className="text-base font-medium">Show Available Stations Only</Label>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-base">Minimum Power (kW)</h4>
              <div className="flex items-center gap-4">
                <Slider
                  min={0}
                  max={350}
                  step={50}
                  value={[filters.minPower]}
                  onValueChange={handlePowerChange}
                />
                <span className="font-semibold w-24 text-right text-base">{filters.minPower} kW</span>
              </div>
            </div>
            {allConnectorTypes.length > 0 && (
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
            )}
             {allNetworks.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-base">Network</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {allNetworks.map(network => (
                  <div key={network} className="flex items-center space-x-3">
                    <Checkbox 
                      id={network} 
                      className="h-5 w-5"
                      checked={filters.networks.includes(network)}
                      onCheckedChange={() => handleNetworkChange(network)}
                    />
                    <Label htmlFor={network} className="text-base">{network}</Label>
                  </div>
                ))}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      
      <ScrollArea className="flex-1">
        {isLoading ? (
           <ListSkeleton />
        ) : (
          renderStationList(stations)
        )}
      </ScrollArea>
    </div>
  );
}
