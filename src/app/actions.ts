'use server';

import { searchByDestination, SearchByDestinationOutput } from '@/ai/flows/search-by-destination';
import { z } from 'zod';

const searchSchema = z.object({
  destination: z.string().min(2, { message: "Destination must be at least 2 characters long." }),
});

type SearchResult = {
  chargingStations: SearchByDestinationOutput['chargingStations'];
  error?: string;
};

export async function handleSearch(input: { destination: string }): Promise<SearchResult> {
  const validation = searchSchema.safeParse(input);

  if (!validation.success) {
    return {
      chargingStations: [],
      error: validation.error.errors.map((e) => e.message).join(', '),
    };
  }
  
  try {
    const result = await searchByDestination(validation.data);
    return { chargingStations: result.chargingStations };
  } catch (error) {
    console.error("Error searching for destination:", error);
    return { 
      chargingStations: [],
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}
