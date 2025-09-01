'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingProps {
  currentRating: number;
  onRate: (rating: number) => void;
  maxRating?: number;
}

export default function Rating({ currentRating, onRate, maxRating = 5 }: RatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={ratingValue}
            type="button"
            onClick={() => onRate(ratingValue)}
            onMouseEnter={() => setHoverRating(ratingValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="cursor-pointer"
            aria-label={`Rate ${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                ratingValue <= (hoverRating || currentRating)
                  ? "text-yellow-400 fill-current"
                  : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
