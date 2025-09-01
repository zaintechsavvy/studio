'use server';

import { getChargingStations, type ChargingStationData } from '@/services/ev-charger';
import { z } from 'zod';

const searchSchema = z.object({
  destination: z.string().min(3, { message: "Search term must be at least 3 characters long." }),
});

type SearchResult = {
  chargingStations: ChargingStationData[];
  error?: string;
};

// Geocoding function to convert address to lat/lon
async function geocodeAddress(address: string): Promise<string | null> {
  // This API key should be in your .env file
  const apiKey = process.env.EV_CHARGER_API_KEY;
  if (!apiKey) {
    console.error("API key for geocoding is not set.");
    return null;
  }
  
  const url = `https://api.api-ninjas.com/v1/geocoding?query=${encodeURIComponent(address)}`;
  try {
    const response = await fetch(url, {
      headers: { 'X-Api-Key': apiKey },
    });
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`Geocoding API call failed with status ${response.status}: ${errorText}`);
        return null;
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

  let lat: string;
  let lon: string;

  if (isLatLng) {
    [lat, lon] = latLngParts.map(part => part.trim());
  } else {
    // If it's not lat,lon, geocode it
    const coordinates = await geocodeAddress(searchInput);
    if (coordinates) {
      [lat, lon] = coordinates.split(',');
    } else {
      return {
        chargingStations: [],
        error: `Could not find location for "${validation.data.destination}". Please try a different search term.`,
      };
    }
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
      error: 'An unexpected error occurred. Please try again.' 
    };
  }
}
