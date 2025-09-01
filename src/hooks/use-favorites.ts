import { useCallback } from 'react';
import useLocalStorage from './use-local-storage';

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('voltsage-favorites', []);

  const toggleFavorite = useCallback((stationId: string) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(stationId)) {
        return prevFavorites.filter(id => id !== stationId);
      } else {
        return [...prevFavorites, stationId];
      }
    });
  }, [setFavorites]);

  const isFavorite = useCallback((stationId: string) => {
    return favorites.includes(stationId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
