'use server';
/**
 * @fileOverview This file defines a streamlined Genkit flow for providing AI-powered first aid guidance.
 * It generates both text instructions and audio to improve user experience.
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
    // 1. Generate the text-based first aid instructions.
    const guidanceResult = await aiPoweredFirstAidGuidance(input);

    // 2. Use the generated instructions to create the audio.
    // We strip markdown for cleaner speech.
    const speechResult = await textToSpeech({
      text: guidanceResult.instructions.replace(/#|\*/g, ''),
      language: input.language,
    });

    // 3. Return both results.
    return {
      instructions: guidanceResult.instructions,
      audioDataUri: speechResult.audioDataUri,
    };
  }
);
