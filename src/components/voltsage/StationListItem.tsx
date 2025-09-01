import type { ChargingStation } from '@/lib/types';
import { Zap, Plug, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StationListItemProps {
  station: ChargingStation;
  onSelectStation: (stationId: string) => void;
  isSelected: boolean;
}

export default function StationListItem({ station, onSelectStation, isSelected }: StationListItemProps) {
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
      className={cn(
        "border rounded-lg cursor-pointer overflow-hidden bg-background hover:bg-accent/80 active:bg-accent",
        "transition-colors duration-200",
        isSelected && "bg-accent border-primary ring-2 ring-primary"
      )}
      onClick={() => onSelectStation(station.id)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-lg leading-tight pr-4">{station.name}</h4>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{station.address}</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 shrink-0 text-primary" />
            <span className={cn("font-medium text-foreground", isFastCharger && "text-green-600")}>{maxPower} kW</span>
            {isFastCharger && <Badge variant="secondary" className="bg-green-100 text-green-800">DC Fast</Badge>}
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 shrink-0 text-primary" />
            <span className="font-medium text-foreground">{totalConnectors} connectors</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}