import { useCallback } from 'react';
import useLocalStorage from './use-local-storage';

type Ratings = { [stationId: string]: number };

export function useRatings() {
  const [ratings, setRatings] = useLocalStorage<Ratings>('voltsage-ratings', {});

  const setRating = useCallback((stationId: string, rating: number) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [stationId]: rating,
    }));
  }, [setRatings]);

  return { ratings, setRating };
}
