import type { ChargingStation } from '@/lib/types';
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
  const maxPower = Math.max(0, ...station.connectors.map(c => c.powerKw));
  const isFastCharger = maxPower >= 50;
  const totalConnectors = station.connectors.reduce((sum, conn) => sum + conn.quantity, 0);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="border rounded-lg cursor-pointer overflow-hidden hover:bg-gray-50 active:bg-gray-100"
      onClick={() => onSelectStation(station.id)}
    >
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-base leading-tight pr-4">{station.name}</h4>
          <Heart className={cn("h-5 w-5 text-muted-foreground transition-colors shrink-0", isFavorite && "text-red-500 fill-current")} />
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{station.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 shrink-0 text-primary" />
            <span className={cn("font-medium text-foreground", isFastCharger && "text-green-600")}>{maxPower} kW</span>
            {isFastCharger && <Badge variant="secondary" className="bg-green-100 text-green-800">DC Fast</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-medium text-foreground">{totalConnectors} connectors</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
