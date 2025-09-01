'use client';

import { Zap, Search, SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntroScreenProps {
    onContinue: () => void;
}

export default function IntroScreen({ onContinue }: IntroScreenProps) {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background p-8">
      <div className="text-center space-y-8 max-w-xl">
        <div className="inline-block rounded-full bg-primary/10 p-5 text-primary">
          <Zap className="h-12 w-12" />
        </div>
        <h1 className="text-5xl font-bold text-foreground tracking-tight">Welcome to Voltsage</h1>
        <p className="text-xl text-muted-foreground">
          Your modern guide to finding the perfect EV charge.
        </p>
        
        <div className="grid grid-cols-1 gap-y-6 pt-8 text-left">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Search className="h-5 w-5"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Search Anywhere</h3>
                    <p className="text-base text-muted-foreground">Enter coordinates or use your current location to find nearby chargers instantly.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                    <SlidersHorizontal className="h-5 w-5"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Filter with Precision</h3>
                    <p className="text-base text-muted-foreground">Filter by power, connector type, network, and real-time availability.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
                    <Star className="h-5 w-5"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Rate & Review</h3>
                    <p className="text-base text-muted-foreground">Select a station from the list to see details and share your experience.</p>
                </div>
            </div>
        </div>

        <div className="pt-8">
            <Button size="lg" className="h-14 px-10 text-lg font-semibold" onClick={onContinue}>
                Continue
            </Button>
        </div>
      </div>
    </div>
  );
}
