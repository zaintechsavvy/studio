import { Zap, Search, SlidersHorizontal, Star, List } from "lucide-react";

export default function Welcome() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-background p-8">
      <div className="text-center space-y-6 max-w-lg">
        <div className="inline-block rounded-full bg-primary/10 p-5 text-primary">
          <List className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-semibold text-foreground tracking-tight">Select a Station</h1>
        <p className="text-lg text-muted-foreground">
          Choose a charging station from the list on the left to view its details, see connector types, and check its current status.
        </p>
      </div>
    </div>
  );
}
