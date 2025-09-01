'use client';

import type { ChargingStation } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import StationListItem from './StationListItem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
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
  <div className="space-y-4 p-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
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
  if (isLoading) {
    return <ListSkeleton />;
  }
  
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

  return (
    <div className="flex h-full flex-col">
       <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'nearby' | 'favorites')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nearby">Nearby</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        <Collapsible className="border-b">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-4 py-3 text-sm font-semibold">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Connector Type</h4>
              <div className="grid grid-cols-2 gap-2">
              {allConnectorTypes.map(connector => (
                <div key={connector} className="flex items-center space-x-2">
                  <Checkbox 
                    id={connector} 
                    checked={filters.connectorTypes.includes(connector)}
                    onCheckedChange={() => handleConnectorChange(connector)}
                  />
                  <Label htmlFor={connector}>{connector}</Label>
                </div>
              ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Minimum Speed (kW)</h4>
              <div className="flex items-center gap-4">
                <Slider
                  min={0}
                  max={350}
                  step={50}
                  value={[filters.minSpeed]}
                  onValueChange={handleSpeedChange}
                />
                <span className="font-semibold w-20 text-right">{filters.minSpeed} kW</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        <TabsContent value="nearby">
          <ScrollArea className="flex-1" style={{ height: 'calc(100vh - 250px)' }}>
            {stations && stations.length > 0 ? (
              <div className="space-y-2 p-2">
                {stations.map(station => (
                  <StationListItem
                    key={station.id}
                    station={station}
                    onSelectStation={onSelectStation}
                    isFavorite={isFavorite(station.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold">No Nearby Stations Found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your filters or searching a different area.
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
         <TabsContent value="favorites">
          <ScrollArea className="flex-1" style={{ height: 'calc(100vh - 250px)' }}>
            {stations && stations.length > 0 ? (
              <div className="space-y-2 p-2">
                {stations.map(station => (
                  <StationListItem
                    key={station.id}
                    station={station}
                    onSelectStation={onSelectStation}
                    isFavorite={isFavorite(station.id)}
                  />
                ))}
              </div>
            ) : (
               <div className="flex h-full items-center justify-center p-8 text-center">
                <div>
                  <h3 className="text-lg font-semibold">No Favorites Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Save stations to see them here.
                  </p>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
