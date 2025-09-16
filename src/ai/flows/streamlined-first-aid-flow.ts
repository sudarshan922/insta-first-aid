'use server';
/**
 * @fileOverview This file defines a streamlined Genkit flow for providing AI-powered first aid guidance.
 * It generates both text instructions and audio in parallel to improve performance.
 *
 * - streamlinedFirstAid - The main function to trigger the flow.
 */

import { ai } from '@/ai/genkit';
import {
  aiPoweredFirstAidGuidance,
} from './ai-powered-first-aid-guidance';
import {
  textToSpeech,
} from './text-to-speech';
import type { StreamlinedFirstAidInput, StreamlinedFirstAidOutput } from '@/ai/schemas/streamlined-first-aid';
import { StreamlinedFirstAidInputSchema, StreamlinedFirstAidOutputSchema } from '@/ai/schemas/streamlined-first-aid';


export async function streamlinedFirstAid(
  input: StreamlinedFirstAidInput
): Promise<StreamlinedFirstAidOutput> {
  return streamlinedFirstAidFlow(input);
}

const streamlinedFirstAidFlow = ai.defineFlow(
  {
    name: 'streamlinedFirstAidFlow',
    inputSchema: StreamlinedFirstAidInputSchema,
    outputSchema: StreamlinedFirstAidOutputSchema,
  },
  async (input) => {
    // 1. Generate the text-based instructions.
    const guidanceResult = await aiPoweredFirstAidGuidance(input);
    const instructions = guidanceResult.instructions;

    // 2. In parallel, generate the audio for the instructions.
    const speechResult = await textToSpeech({
      text: instructions.replace(/#|\*/g, ''), // Remove markdown for cleaner speech
      language: input.language,
    });
    
    // 3. Return both results.
    return {
      instructions: instructions,
      audioDataUri: speechResult.audioDataUri,
    };
  }
);
