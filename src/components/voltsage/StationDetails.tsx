'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChargingStation } from '@/lib/types';
import { ArrowLeft, Heart, MapPin, Network, Plug, Zap, DollarSign, Navigation, Info } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

interface StationDetailsProps {
  station: ChargingStation;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rating: number;
  onRate: (rating: number) => void;
}

const DetailRow = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) => (
  <div className="flex items-start gap-4">
    <Icon className="h-5 w-5 mt-1 text-primary shrink-0" />
    <div className="flex-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base text-foreground font-medium">{children}</div>
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

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="flex items-center gap-2 border-b border-white/20 p-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10 rounded-full">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h3 className="text-lg font-semibold tracking-tight truncate flex-1">{station.name}</h3>
        <Button variant="ghost" size="icon" onClick={onToggleFavorite} className="shrink-0 h-10 w-10 rounded-full">
          <Heart className={cn("h-5 w-5 text-muted-foreground", isFavorite && "text-red-500 fill-current")} />
          <span className="sr-only">Toggle Favorite</span>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full h-12 text-base font-semibold">
                <Navigation className="mr-2 h-5 w-5" />
                Navigate
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem onClick={handleNavigateGoogle} className="text-base py-2">
                Google Maps
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNavigateApple} className="text-base py-2">
                Apple Maps
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Card className="bg-white/30 border-none shadow-none">
            <CardContent className="p-4 space-y-4">
              <DetailRow icon={MapPin} label="Address">
                {station.address}
              </DetailRow>
              <Separator />
               <DetailRow icon={Info} label="Availability">
                <Badge 
                  variant={station.availability.toLowerCase().includes('24/7') ? 'default' : 'secondary'}
                  className={cn(station.availability.toLowerCase().includes('24/7') ? 'bg-green-100 text-green-800 border-green-200' : '')}
                >
                  {station.availability}
                </Badge>
              </DetailRow>
              <Separator />
              <DetailRow icon={Zap} label="Charging Speed">
                  {station.speed}
              </DetailRow>
              <Separator />
              <DetailRow icon={Plug} label="Connectors">
                <div className="flex flex-wrap gap-2">
                  {station.connectorTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="text-base py-1 px-3">{type}</Badge>
                  ))}
                </div>
              </DetailRow>
              <Separator />
               <DetailRow icon={Network} label="Network">
                {station.network}
              </DetailRow>
              <Separator />
               <DetailRow icon={DollarSign} label="Pricing">
                {station.pricing}
              </DetailRow>
            </CardContent>
          </Card>

          <Card className="bg-white/30 border-none shadow-none">
            <CardHeader>
              <CardTitle>Rate this Station</CardTitle>
              <CardDescription>Help others by sharing your experience.</CardDescription>
            </CardHeader>
            <CardContent>
              <Rating currentRating={rating} onRate={onRate} />
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
