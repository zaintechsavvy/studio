import { Zap } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col items-center gap-4 text-center p-8">
      <div className="rounded-full bg-primary/20 p-4 text-primary border-2 border-primary/30">
        <Zap className="h-12 w-12" />
      </div>
      <h1 className="text-5xl font-bold text-foreground tracking-tight">Voltsage</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        The modern, user-friendly EV charging web app. Find your next charge with ease and style.
      </p>
    </div>
  );
}
