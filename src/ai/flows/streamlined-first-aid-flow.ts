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
    // 1. Generate the text-based instructions first.
    const guidanceResult = await aiPoweredFirstAidGuidance(input);
    const instructions = guidanceResult.instructions;

    // 2. Asynchronously generate the audio for the instructions.
    // We don't await this promise here, we do it in Promise.all below.
    const speechPromise = textToSpeech({
      text: instructions.replace(/#|\*/g, ''), // Remove markdown for cleaner speech
      language: input.language,
    });
    
    // 3. This is a bit of a trick. We already have the text,
    // so we can resolve that part of the promise immediately.
    const instructionPromise = Promise.resolve({ instructions });

    // 4. Wait for both text and audio to be ready.
    // The text promise will resolve instantly. The audio will take longer.
    const [instructionResult, speechResult] = await Promise.all([
        instructionPromise,
        speechPromise,
    ]);

    return {
      instructions: instructionResult.instructions,
      audioDataUri: speechResult.audioDataUri,
    };
  }
);
