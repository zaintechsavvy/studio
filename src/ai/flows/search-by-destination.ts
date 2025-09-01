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
  destination: z.string().describe('The destination address to search for charging stations near.'),
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
    description: 'Get a list of EV charging stations near a given location.',
    inputSchema: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
    outputSchema: SearchByDestinationOutputSchema,
  },
  async (input) => {
    // In a real app, you would fetch this from a real API.
    // This is a mock implementation for demonstration purposes.
    console.log(`Fetching stations near ${input.latitude}, ${input.longitude}`);
    return {
      chargingStations: [
        { name: "ChargePoint City Hall", address: "123 Main St, Anytown, USA", latitude: 34.0522, longitude: -118.2437, network: "ChargePoint", speed: "50kW", connectorTypes: ["J1772", "CHAdeMO"], availability: "2/4 Available", pricing: "$0.25/kWh" },
        { name: "EVgo Super Fast", address: "456 Oak Ave, Anytown, USA", latitude: 34.055, longitude: -118.25, network: "EVgo", speed: "150kW", connectorTypes: ["CCS", "CHAdeMO"], availability: "3/4 Available", pricing: "$0.35/kWh" },
        { name: "Electrify America Hub", address: "789 Pine Ln, Anytown, USA", latitude: 34.05, longitude: -118.24, network: "Electrify America", speed: "350kW", connectorTypes: ["CCS"], availability: "4/4 Available", pricing: "$0.43/kWh" },
        { name: "Tesla Supercharger Central", address: "101 Maple Dr, Anytown, USA", latitude: 34.06, longitude: -118.245, network: "Tesla", speed: "250kW", connectorTypes: ["Tesla"], availability: "8/12 Available", pricing: "$0.28/kWh" }
      ]
    };
  }
);


const prompt = ai.definePrompt({
  name: 'searchByDestinationPrompt',
  input: {schema: SearchByDestinationInputSchema},
  output: {schema: SearchByDestinationOutputSchema},
  tools: [getChargingStationsTool],
  prompt: `You are an expert EV charging station finder. Given a destination address, find the latitude and longitude and then use the getChargingStationsTool to find charging stations.

  Destination: {{{destination}}}
`,
});

const searchByDestinationFlow = ai.defineFlow(
  {
    name: 'searchByDestinationFlow',
    inputSchema: SearchByDestinationInputSchema,
    outputSchema: SearchByDestinationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
