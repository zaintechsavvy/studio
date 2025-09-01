'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChargingStation } from '@/ai/flows/find-chargers-flow';
import { ArrowLeft, Heart, MapPin, Network, Plug, Zap, DollarSign, Navigation, Users, Image as ImageIcon } from 'lucide-react';
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
import Image from 'next/image';

interface StationDetailsProps {
  station: ChargingStation;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rating: number;
  onRate: (rating: number) => void;
  isPillVariant?: boolean;
}

const DetailRow = ({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode; }) => (
  <div className="flex items-start gap-4">
    <Icon className="h-5 w-5 mt-1 text-primary shrink-0" />
    <div className="flex-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="text-base text-foreground font-medium">{children}</div>
    </div>
  </div>
);

export default function StationDetails({ station, onBack, isFavorite, onToggleFavorite, rating, onRate, isPillVariant = true }: StationDetailsProps) {
  
  const handleNavigateGoogle = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleNavigateApple = () => {
    const appleMapsUrl = `https://maps.apple.com/?daddr=${station.latitude},${station.longitude}`;
    window.open(appleMapsUrl, '_blank');
  };

  const maxPower = Math.max(...station.connectors.map(c => c.powerKw));
  const isFastCharger = maxPower >= 50;

  if (isPillVariant) {
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
            {station.photoUrl && (
              <div className="aspect-video w-full relative rounded-lg overflow-hidden border">
                <Image src={station.photoUrl} alt={`Photo of ${station.name}`} fill className="object-cover" />
              </div>
            )}
            
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
                 <DetailRow icon={Users} label="Availability">
                  <Badge variant={station.availability.inUse === 0 ? 'default' : 'secondary'}
                    className={cn(station.availability.inUse === 0 ? 'bg-green-100 text-green-800 border-green-200' : '')}>
                    {station.availability.available} / {station.availability.total} Available
                  </Badge>
                </DetailRow>
                <Separator />
                <DetailRow icon={Zap} label="Max Speed">
                    <div className="flex items-center gap-2">
                      <span className={cn(isFastCharger && "text-green-600 font-bold")}>{maxPower} kW</span>
                      {isFastCharger && <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">DC Fast</Badge>}
                    </div>
                </DetailRow>
                <Separator />
                <DetailRow icon={Plug} label="Connectors">
                  <div className="flex flex-wrap gap-2">
                    {station.connectors.map((c, i) => (
                      <Badge key={i} variant="secondary" className="text-base py-1 px-3">{c.type} ({c.powerKw}kW)</Badge>
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

  return (
    <div className="w-full h-full flex flex-col p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{station.name}</h2>
          <p className="text-muted-foreground">{station.address}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onToggleFavorite} className="shrink-0 h-10 w-10 rounded-full">
          <Heart className={cn("h-6 w-6 text-muted-foreground", isFavorite && "text-red-500 fill-current")} />
          <span className="sr-only">Toggle Favorite</span>
        </Button>
      </div>
      
      {station.photoUrl && (
        <div className="aspect-video w-full relative rounded-lg overflow-hidden border mb-4">
          <Image src={station.photoUrl} alt={`Photo of ${station.name}`} fill className="object-cover" />
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
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
      </div>

      <ScrollArea className="flex-1 -mx-6">
        <div className="px-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <DetailRow icon={Users} label="Availability">
              <Badge variant={station.availability.inUse === 0 ? 'default' : 'secondary'}
                className={cn(station.availability.inUse === 0 ? 'bg-green-100 text-green-800 border-green-200' : '')}>
                {station.availability.available} / {station.availability.total} Available
              </Badge>
            </DetailRow>
            <DetailRow icon={Zap} label="Max Speed">
               <div className="flex items-center gap-2">
                <span className={cn(isFastCharger && "text-green-600 font-bold")}>{maxPower} kW</span>
                {isFastCharger && <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">DC Fast</Badge>}
              </div>
            </DetailRow>
            <DetailRow icon={Network} label="Network">
              {station.network}
            </DetailRow>
            <DetailRow icon={DollarSign} label="Pricing">
              {station.pricing}
            </DetailRow>
          </div>

          <DetailRow icon={Plug} label="Connectors">
            <div className="flex flex-wrap gap-2">
              {station.connectors.map((c, i) => (
                <Badge key={i} variant="secondary" className="text-base py-1 px-3">{c.type} ({c.powerKw}kW)</Badge>
              ))}
            </div>
          </DetailRow>
          
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
