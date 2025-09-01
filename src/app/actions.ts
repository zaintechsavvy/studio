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

// Geocoding function to convert address to lat/lon
async function geocodeAddress(address: string): Promise<string | null> {
  const url = `https://api.api-ninjas.com/v1/geocoding?city=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(url, {
      headers: {
        'X-Api-Key': process.env.EV_CHARGER_API_KEY!,
      },
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Geocoding API call failed with status ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    if (data && data.length > 0) {
      const { latitude, longitude } = data[0];
      return `${latitude},${longitude}`;
    }
    return null;
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}


export async function handleSearch(input: { destination: string }): Promise<SearchResult> {
  const validation = searchSchema.safeParse(input);

  if (!validation.success) {
    return {
      chargingStations: [],
      error: validation.error.errors.map((e) => e.message).join(', '),
    };
  }

  let searchInput = validation.data.destination;

  // Check if the input is lat,lon or an address
  const latLngParts = searchInput.split(',');
  const isLatLng = latLngParts.length === 2 && !isNaN(parseFloat(latLngParts[0])) && !isNaN(parseFloat(latLngParts[1]));

  if (!isLatLng) {
    // If it's not lat,lon, geocode it
    const coordinates = await geocodeAddress(searchInput);
    if (coordinates) {
      searchInput = coordinates;
    } else {
      return {
        chargingStations: [],
        error: `Could not find location for "${validation.data.destination}". Please try a different search.`,
      };
    }
  }
  
  try {
    const result = await searchByDestination({ destination: searchInput });
    return { chargingStations: result.chargingStations };
  } catch (error) {
    console.error("Error searching for destination:", error);
    return { 
      chargingStations: [],
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}