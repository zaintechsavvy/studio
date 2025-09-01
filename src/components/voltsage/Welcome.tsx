import { Zap, Search, SlidersHorizontal, Star } from "lucide-react";

export default function Welcome() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-8">
      <div className="text-center space-y-6 max-w-lg">
        <div className="inline-block rounded-full bg-primary/10 p-5 text-primary">
          <Zap className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-semibold text-foreground tracking-tight">Welcome to Voltsage</h1>
        <p className="text-lg text-muted-foreground">
          Your modern guide to finding the perfect EV charge.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 text-left">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Search className="h-5 w-5"/>
                </div>
                <div>
                    <h3 className="text-base font-semibold">Search Anywhere</h3>
                    <p className="text-sm text-muted-foreground">Enter coordinates or use your current location to find nearby chargers instantly.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <SlidersHorizontal className="h-5 w-5"/>
                </div>
                <div>
                    <h3 className="text-base font-semibold">Filter with Precision</h3>
                    <p className="text-sm text-muted-foreground">Filter by power, connector type, network, and real-time availability.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Star className="h-5 w-5"/>
                </div>
                <div>
                    <h3 className="text-base font-semibold">Rate & Review</h3>
                    <p className="text-sm text-muted-foreground">Select a station from the list on the left to see details and share your experience.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
