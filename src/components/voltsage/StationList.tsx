'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import type { ChargingStation } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import StationListItem from './StationListItem';

interface StationListProps {
  stations: ChargingStation[] | null;
  isLoading: boolean;
  onSelectStation: (stationId: string) => void;
  showFavorites: boolean;
  onToggleShowFavorites: () => void;
  isFavorite: (stationId: string) => boolean;
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
  showFavorites,
  onToggleShowFavorites,
  isFavorite
}: StationListProps) {
  if (isLoading) {
    return <ListSkeleton />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <h3 className="text-lg font-semibold tracking-tight">
          {showFavorites ? 'Favorite Stations' : 'Nearby Stations'}
        </h3>
        <div className="flex items-center space-x-2">
          <Switch
            id="favorites-only"
            checked={showFavorites}
            onCheckedChange={onToggleShowFavorites}
            aria-label="Show favorites only"
          />
          <Label htmlFor="favorites-only">
            <Heart className={`h-5 w-5 ${showFavorites ? 'text-red-500 fill-current' : 'text-muted-foreground'}`} />
          </Label>
        </div>
      </div>
      <ScrollArea className="flex-1">
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
              <h3 className="text-lg font-semibold">
                {showFavorites ? 'No Favorites Yet' : 'No Stations Found'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {showFavorites ? 'Save stations to see them here.' : 'Try a new search to find charging stations.'}
              </p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
