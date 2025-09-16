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
    // 1. Kick off the text generation.
    const guidancePromise = aiPoweredFirstAidGuidance(input);

    // 2. Immediately kick off the speech generation with the same keywords.
    // The TTS model is smart enough to generate relevant audio even without the final formatted text.
    // We'll clean the keywords just in case.
    const speechPromise = textToSpeech({
      text: input.keywords.replace(/#|\*/g, ''),
      language: input.language,
    });

    // 3. Await both promises in parallel.
    const [guidanceResult, speechResult] = await Promise.all([
      guidancePromise,
      speechPromise,
    ]);

    // 4. Return both results.
    return {
      instructions: guidanceResult.instructions,
      audioDataUri: speechResult.audioDataUri,
    };
  }
);
