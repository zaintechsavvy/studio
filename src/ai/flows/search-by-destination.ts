'use server';

/**
 * @fileOverview Allows users to search for charging stations by entering a destination address, so that they can plan their route and find convenient charging options along the way.
 *
 * - searchByDestination - A function that handles the search for charging stations by destination.
 * - SearchByDestinationInput - The input type for the searchByDestination function.
 * - SearchByDestinationOutput - The return type for the searchByDestination function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchByDestinationInputSchema = z.object({
  destination: z.string().describe('The destination address to search for charging stations near. Can be an address or "latitude,longitude".'),
});
export type SearchByDestinationInput = z.infer<typeof SearchByDestinationInputSchema>;

const ChargingStationSchema = z.object({
  name: z.string().describe('The name of the charging station.'),
  address: z.string().describe('The address of the charging station.'),
  latitude: z.number().describe('The latitude of the charging station.'),
  longitude: z.number().describe('The longitude of the charging station.'),
  network: z.string().describe('The network the charging station belongs to.'),
  speed: z.string().describe('The charging speed of the station (e.g., 50kW, 150kW).'),
  connectorTypes: z.array(z.string()).describe('The types of connectors available at the station (e.g., CHAdeMO, CCS, Tesla).'),
  availability: z.string().describe('Real-time availability of chargers at the station.'),
  pricing: z.string().describe('Pricing information for using the charging station.'),
});

const SearchByDestinationOutputSchema = z.object({
  chargingStations: z.array(ChargingStationSchema).describe('A list of charging stations near the destination.'),
});

export type SearchByDestinationOutput = z.infer<typeof SearchByDestinationOutputSchema>;

export async function searchByDestination(input: SearchByDestinationInput): Promise<SearchByDestinationOutput> {
  return searchByDestinationFlow(input);
}

const getChargingStationsTool = ai.defineTool(
  {
    name: 'getChargingStationsTool',
    description: 'Get a list of EV charging stations near a given location based on real-world data.',
    inputSchema: z.object({
      query: z.string().describe("The user's search query, which can be a location, address, or point of interest. Can be an address or comma-separated latitude and longitude."),
    }),
    outputSchema: SearchByDestinationOutputSchema,
  },
  async (input) => {
    console.log(`Fetching real stations for query: ${input.query}`);
    
    let url = 'https://api.api-ninjas.com/v1/evchargers?';
    
    const latLng = input.query.split(',');
    if (latLng.length === 2 && !isNaN(parseFloat(latLng[0])) && !isNaN(parseFloat(latLng[1]))) {
        url += `latitude=${parseFloat(latLng[0])}&longitude=${parseFloat(latLng[1])}&radius=50`;
    } else {
        url += `address=${encodeURIComponent(input.query)}`;
    }
    
    try {
      const response = await fetch(url, {
        headers: {
          'X-Api-Key': process.env.EV_CHARGER_API_KEY!,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed with status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();

      const chargingStations = data.map((station: any) => {
        
        let connectorTypes: string[] = [];
        if (station.connections && station.connections.length > 0) {
          connectorTypes = [...new Set(station.connections.map((c: any) => c.type_name).filter(Boolean))];
        }
        if (connectorTypes.length === 0) {
          connectorTypes.push('Unknown');
        }

        let speed = "N/A";
        if (station.connections && station.connections.length > 0) {
            const levels = station.connections.map((c:any) => c.level);
            if (levels.includes(3)) {
                speed = "DC Fast Charging";
            } else if (levels.includes(2)) {
                speed = "Level 2";
            } else if (levels.includes(1)) {
                speed = "Level 1";
            }
        }
        
        return {
          name: station.station_name || station.name || 'Unknown Station',
          address: `${station.address || station.street_address}, ${station.city}, ${station.region || station.state} ${station.zip || ''}`.replace(/, ,/g, ','),
          latitude: station.latitude,
          longitude: station.longitude,
          network: station.ev_network || 'Unknown',
          speed: speed,
          connectorTypes: connectorTypes,
          availability: station.is_active ? '24/7' : 'Varies',
          pricing: station.ev_pricing || 'Varies',
        };
      });

      return { chargingStations };

    } catch (error) {
      console.error("Failed to fetch charging stations:", error);
      return { chargingStations: [] };
    }
  }
);


const searchByDestinationFlow = ai.defineFlow(
  {
    name: 'searchByDestinationFlow',
    inputSchema: SearchByDestinationInputSchema,
    outputSchema: SearchByDestinationOutputSchema,
  },
  async input => {
    // Directly call the tool since the logic is straightforward now.
    return getChargingStationsTool({ query: input.destination });
  }
);
