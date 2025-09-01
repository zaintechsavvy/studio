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

const prompt = ai.definePrompt({
  name: 'searchByDestinationPrompt',
  input: {schema: SearchByDestinationInputSchema},
  output: {schema: SearchByDestinationOutputSchema},
  prompt: `You are an expert EV charging station finder. Given a destination address, you will find a list of charging stations near that destination.

  Destination: {{{destination}}}

  Return a JSON array of charging stations with the following information for each:
  - name
  - address
  - latitude
  - longitude
  - network
  - speed
  - connectorTypes (as an array of strings)
  - availability
  - pricing`,
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
