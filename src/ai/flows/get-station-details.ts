'use server';
/**
 * @fileOverview A flow for getting enriched details about an EV charging station.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const StationDetailsInputSchema = z.object({
  name: z.string().describe('The name of the charging station.'),
  address: z.string().describe('The address of the charging station.'),
});

const StationDetailsOutputSchema = z.object({
  network: z.string().describe('The charging network provider (e.g., Electrify America, EVgo, ChargePoint). If not specified, use "Unknown".'),
  pricing: z.string().describe('A summary of the pricing. For example, "$0.48/kWh" or "Per-minute fees may apply". If not specified, use "Varies".'),
  availability: z.string().describe('The hours of operation for the station (e.g., "24/7", "6 AM - 10 PM"). If not specified, use "Varies".'),
});

export type EnrichedStationDetails = z.infer<typeof StationDetailsOutputSchema>;

export async function getStationDetails(input: z.infer<typeof StationDetailsInputSchema>): Promise<EnrichedStationDetails> {
  return stationDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'stationDetailsPrompt',
  input: { schema: StationDetailsInputSchema },
  output: { schema: StationDetailsOutputSchema },
  prompt: `You are an expert on EV charging stations.
    Given the name and address of a charging station, find more information about it online.
    Provide the network provider, a summary of the pricing, and the hours of operation.
    
    Station Name: {{{name}}}
    Address: {{{address}}}
    
    Only use information you can verify from public sources.
    If you cannot find a specific piece of information, use a sensible default like "Unknown" or "Varies".`,
});

const stationDetailsFlow = ai.defineFlow(
  {
    name: 'stationDetailsFlow',
    inputSchema: StationDetailsInputSchema,
    outputSchema: StationDetailsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
