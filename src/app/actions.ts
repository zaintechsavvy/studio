'use server';

import { getChargingStations } from '@/services/nrel-api';
import type { ChargingStation } from '@/lib/types';
import { z } from 'zod';

const searchSchema = z.object({
  lat: z.number(),
  lon: z.number(),
});

type SearchResult = {
  chargingStations: ChargingStation[];
  error?: string;
};

export async function handleSearch(input: { destination: string }): Promise<SearchResult> {
  let lat: number;
  let lon: number;

  try {
    const [latStr, lonStr] = input.destination.split(',');
    lat = parseFloat(latStr);
    lon = parseFloat(lonStr);

    const validation = searchSchema.safeParse({ lat, lon });
    if (!validation.success) {
      throw new Error('Invalid coordinates provided.');
    }
  } catch (error) {
    return {
      chargingStations: [],
      error: 'Invalid input. Please provide coordinates in "latitude,longitude" format.',
    };
  }

  try {
    const result = await getChargingStations({ lat, lon });
    return { chargingStations: result };
  } catch (error) {
    console.error("Error searching for destination:", error);
    if (error instanceof Error) {
       return { 
         chargingStations: [],
         error: error.message
       };
    }
    return { 
      chargingStations: [],
      error: 'An unexpected error occurred while searching for chargers. Please try again.' 
    };
  }
}
