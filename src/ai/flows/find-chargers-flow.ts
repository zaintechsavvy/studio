'use server';
/**
 * @fileOverview A flow for finding detailed information about EV charging stations near a location.
 *
 * - findNearbyChargers - A function that returns a list of nearby EV charging stations with rich details.
 * - ChargingStation - The output type for a single charging station.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FindChargersInputSchema = z.object({
  lat: z.number().describe('The latitude of the location to search near.'),
  lon: z.number().describe('The longitude of the location to search near.'),
});

const ConnectorSchema = z.object({
  type: z.string().describe('The type of the connector (e.g., "J-1772", "Tesla (NACS)", "CCS Combo 1").'),
  powerKw: z.number().describe('The power of the connector in kilowatts.'),
});

const AvailabilitySchema = z.object({
  total: z.number().describe('The total number of chargers at this station.'),
  available: z.number().describe('The number of chargers currently available.'),
  inUse: z.number().describe('The number of chargers currently in use.'),
});

const ChargingStationSchema = z.object({
  id: z.string().describe('A unique identifier for the station.'),
  name: z.string().describe('The name of the charging station.'),
  address: z.string().describe('The full street address of the charging station.'),
  latitude: z.number().describe('The geographical latitude of the station.'),
  longitude: z.number().describe('The geographical longitude of the station.'),
  network: z.string().describe('The charging network provider (e.g., "Electrify America", "EVgo", "ChargePoint").'),
  pricing: z.string().describe('A summary of the pricing. For example, "$0.48/kWh" or "Per-minute fees may apply".'),
  connectors: z.array(ConnectorSchema).describe('A list of available connectors at the station.'),
  availability: AvailabilitySchema.describe('The real-time availability of chargers at the station.'),
  photoUrl: z.string().url().describe('A publicly accessible URL for a photo of the charging station.'),
});

const FindChargersOutputSchema = z.array(ChargingStationSchema);

export type ChargingStation = z.infer<typeof ChargingStationSchema>;

export async function findNearbyChargers(input: z.infer<typeof FindChargersInputSchema>): Promise<ChargingStation[]> {
  return findChargersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findChargersPrompt',
  input: { schema: FindChargersInputSchema },
  output: { schema: FindChargersOutputSchema },
  prompt: `You are an expert assistant for finding EV charging stations.
    Given a latitude and longitude, find the 5 closest, publicly accessible EV charging stations.
    
    For each station, provide comprehensive details including real-time availability and a photo.
    - Accurately determine the total number of chargers, how many are available, and how many are in use.
    - Find a publicly accessible URL for a high-quality photo of the station itself.
    - If you cannot find a specific piece of information, make a reasonable estimate, but never leave a field blank. For photoUrl, if a real one cannot be found, use a placeholder from picsum.photos.

    Search near: Latitude {{{lat}}}, Longitude {{{lon}}}
    
    Return a list of the 5 closest stations.`,
});

const findChargersFlow = ai.defineFlow(
  {
    name: 'findChargersFlow',
    inputSchema: FindChargersInputSchema,
    outputSchema: FindChargersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output || [];
  }
);
