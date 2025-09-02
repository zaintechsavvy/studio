
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { ChargingStation } from '@/lib/types';
import { Heart, MapPin, Network, Plug, Zap, DollarSign, Navigation, Clock, Building, Info, ExternalLink, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Rating from './Rating';
import { Separator } from '@/components/ui/separator';

interface StationDetailsProps {
  station: ChargingStation;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  rating: number;
  onRate: (rating: number) => void;
  onBack?: () => void;
}

const DetailRow = ({ icon: Icon, label, children, labelClass }: { icon: React.ElementType; label: string; children: React.ReactNode; labelClass?: string }) => (
  <div className="flex items-start gap-4 py-4">
    <Icon className="h-6 w-6 mt-1 text-primary shrink-0" />
    <div className="flex-1">
      <p className={cn("text-base font-medium text-muted-foreground", labelClass)}>{label}</p>
      <div className="text-lg text-foreground font-semibold">{children}</div>
    </div>
  </div>
);

export default function StationDetails({ station, isFavorite, onToggleFavorite, rating, onRate, onBack }: StationDetailsProps) {
  
  const handleNavigate = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;
    window.open(googleMapsUrl, '_blank');
  };
  
  const handleViewSource = () => {
    if (station.sourceUrl) {
      window.open(station.sourceUrl, '_blank');
    }
  };

  const totalConnectors = station.connectors.reduce((sum, conn) => sum + conn.quantity, 0);

  return (
    <div className="flex h-dvh flex-col bg-background">
      <header className="flex items-center gap-4 p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Back to list</span>
          </Button>
        )}
        <h1 className="text-xl font-bold tracking-tight text-foreground truncate">{station.name}</h1>
        <Button variant="ghost" size="icon" onClick={onToggleFavorite} className="shrink-0 h-11 w-11 rounded-full ml-auto">
          <Heart className={cn("h-6 w-6 text-muted-foreground", isFavorite && "text-red-500 fill-current")} />
          <span className="sr-only">Toggle Favorite</span>
        </Button>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 md:p-8 lg:p-12 space-y-8">
            <div className="flex flex-wrap gap-4">
                <Button className="h-12 text-base font-semibold px-6 flex-grow md:flex-grow-0" onClick={handleNavigate}>
                    <Navigation className="mr-2 h-5 w-5" />
                    Navigate
                </Button>
                <Button variant="outline" className="h-12 text-base font-semibold px-6 flex-grow md:flex-grow-0" onClick={handleViewSource} disabled={!station.sourceUrl}>
                    <ExternalLink className="mr-2 h-5 w-5" />
                    View Source
                </Button>
            </div>

            <Card className="shadow-lg border-2">
                <CardContent className="p-2 md:p-4">
                    <DetailRow icon={MapPin} label="Address">{station.address}</DetailRow>
                    <Separator />
                    <DetailRow icon={Network} label="Network">{station.network}</DetailRow>
                    <Separator />
                    <DetailRow icon={DollarSign} label="Pricing">{station.pricing || 'Information not available'}</DetailRow>
                    <Separator />
                    <DetailRow icon={Clock} label="Hours">{station.operatingHours || '24/7'}</DetailRow>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Connectors</CardTitle>
                    <CardDescription>Total of {totalConnectors} connectors at this location.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                    {station.connectors.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-4">
                                <Plug className="h-6 w-6 text-primary"/>
                                <div>
                                    <p className="text-lg font-bold">{c.type}</p>
                                    <p className="text-sm text-muted-foreground">{c.quantity}x available</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="text-lg py-1 px-4 border-2">{c.powerKw}kW</Badge>
                        </div>
                    ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-2">
                <CardHeader>
                    <CardTitle>Additional Info</CardTitle>
                </CardHeader>
                <CardContent className="p-2 md:p-4">
                     <DetailRow icon={Building} label="Facility Type">{station.facilityType || "N/A"}</DetailRow>
                     <Separator />
                     <DetailRow icon={Info} label="Access">{station.accessType}</DetailRow>
                </CardContent>
            </Card>

            <Card className="shadow-lg border-2">
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

    