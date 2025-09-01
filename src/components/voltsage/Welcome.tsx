import { Zap, Search, SlidersHorizontal, Star } from "lucide-react";

export default function Welcome() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-8">
      <div className="text-center space-y-8 max-w-lg">
        <div className="inline-block rounded-full bg-primary/20 p-6 text-primary border-4 border-primary/30">
          <Zap className="h-16 w-16" />
        </div>
        <h1 className="text-5xl font-bold text-foreground tracking-tight">Welcome to Voltsage</h1>
        <p className="text-xl text-muted-foreground">
          Your modern guide to finding the perfect EV charge.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 text-left">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Search className="h-6 w-6"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Search Anywhere</h3>
                    <p className="text-muted-foreground">Enter coordinates or use your current location to find nearby chargers instantly.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <SlidersHorizontal className="h-6 w-6"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Filter with Precision</h3>
                    <p className="text-muted-foreground">Filter by power, connector type, network, and real-time availability.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Star className="h-6 w-6"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Rate & Review</h3>
                    <p className="text-muted-foreground">Select a station from the list on the left to see details and share your experience.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}