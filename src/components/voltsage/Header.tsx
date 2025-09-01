import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b bg-card px-4 sm:px-6 z-10 shrink-0">
      <div className="flex items-center gap-2">
        <div className="rounded-full bg-primary p-2 text-primary-foreground">
          <Zap className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Voltsage</h1>
      </div>
    </header>
  );
}
