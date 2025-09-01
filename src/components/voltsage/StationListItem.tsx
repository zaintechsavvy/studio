import { Card, CardContent } from '@/components/ui/card';
import type { ChargingStation } from '@/lib/types';
import { Zap, Plug, MapPin, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StationListItemProps {
  station: ChargingStation;
  onSelectStation: (stationId: string) => void;
  isFavorite: boolean;
}

export default function StationListItem({ station, onSelectStation, isFavorite }: StationListItemProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary"
      onClick={() => onSelectStation(station.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <h4 className="font-semibold text-lg mb-2 pr-4">{station.name}</h4>
          <Heart className={cn("h-5 w-5 text-muted-foreground transition-colors", isFavorite && "text-red-500 fill-current")} />
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{station.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 shrink-0" />
            <span>{station.speed}</span>
            <Badge variant="secondary">{station.availability}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Plug className="h-4 w-4 shrink-0" />
            <div className="flex flex-wrap gap-1">
              {station.connectorTypes.map(type => (
                <Badge key={type} variant="outline">{type}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
