'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChargingStation } from '@/lib/types';
import { ArrowLeft, Heart, MapPin, Network, Plug, Zap, DollarSign, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Rating from './Rating';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface StationDetailsProps {
  station: ChargingStation;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rating: number;
  onRate: (rating: number) => void;
}

const DetailRow = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-4 py-3">
    <Icon className="h-5 w-5 mt-1 text-primary" />
    <div className="flex-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base text-foreground">{children}</div>
    </div>
  </div>
);

export default function StationDetails({ station, onBack, isFavorite, onToggleFavorite, rating, onRate }: StationDetailsProps) {
  
  const handleNavigateGoogle = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleNavigateApple = () => {
    const appleMapsUrl = `https://maps.apple.com/?daddr=${station.latitude},${station.longitude}`;
    window.open(appleMapsUrl, '_blank');
  };
  
  const availabilityColor = station.availability.toLowerCase().includes('avail') ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b p-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h3 className="text-lg font-semibold tracking-tight truncate flex-1">{station.name}</h3>
        <Button variant="ghost" size="icon" onClick={onToggleFavorite} className="shrink-0">
          <Heart className={cn("h-5 w-5 text-muted-foreground", isFavorite && "text-red-500 fill-current")} />
          <span className="sr-only">Toggle Favorite</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full">
                <Navigation className="mr-2 h-4 w-4" />
                Navigate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={handleNavigateGoogle}>
                Google Maps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigateApple}>
                Apple Maps
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                <DetailRow icon={MapPin} label="Address">
                  {station.address}
                </DetailRow>
                <DetailRow icon={Zap} label="Charging Speed">
                  <div className="flex items-center gap-2">
                    <span>{station.speed}</span>
                    <Badge className={cn("text-white", availabilityColor)}>
                      {station.availability}
                    </Badge>
                  </div>
                </DetailRow>
                <DetailRow icon={Plug} label="Connectors">
                  <div className="flex flex-wrap gap-2">
                    {station.connectorTypes.map((type) => (
                      <Badge key={type} variant="secondary">{type}</Badge>
                    ))}
                  </div>
                </DetailRow>
                 <DetailRow icon={Network} label="Network">
                  {station.network}
                </DetailRow>
                 <DetailRow icon={DollarSign} label="Pricing">
                  {station.pricing}
                </DetailRow>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Reliability Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Rate this station to help others.</p>
              <Rating currentRating={rating} onRate={onRate} />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
