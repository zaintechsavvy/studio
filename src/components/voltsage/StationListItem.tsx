import type { ChargingStation } from '@/ai/flows/find-chargers-flow';
import { Zap, Plug, MapPin, Heart, ChevronRight, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StationListItemProps {
  station: ChargingStation;
  onSelectStation: (stationId: string) => void;
  isFavorite: boolean;
}

export default function StationListItem({ station, onSelectStation, isFavorite }: StationListItemProps) {
  const maxPower = Math.max(...station.connectors.map(c => c.powerKw));
  const isFastCharger = maxPower >= 50;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="glass-card cursor-pointer overflow-hidden"
      onClick={() => onSelectStation(station.id)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-lg leading-tight pr-4">{station.name}</h4>
          <Heart className={cn("h-5 w-5 text-muted-foreground transition-colors shrink-0", isFavorite && "text-red-500 fill-current")} />
        </div>
        
        <div className="space-y-2.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{station.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 shrink-0 text-primary" />
            <span className={cn("font-medium text-foreground", isFastCharger && "text-green-600")}>{maxPower} kW</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-medium text-foreground">{station.availability.available} / {station.availability.total} available</span>
          </div>
          <div className="flex items-center gap-2">
            <Plug className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex flex-wrap gap-1.5">
              {station.connectors.slice(0, 3).map((c, i) => (
                <Badge key={i} variant="secondary">{c.type}</Badge>
              ))}
              {station.connectors.length > 3 && (
                <Badge variant="outline">+{station.connectors.length - 3}</Badge>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white/20 px-4 py-2 flex items-center justify-end text-xs font-semibold text-primary">
          Details <ChevronRight className="h-4 w-4 ml-1" />
      </div>
    </motion.div>
  );
}
