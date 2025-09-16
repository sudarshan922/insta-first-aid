'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing AI-powered first aid guidance based on user-provided keywords.
 *
 * - aiPoweredFirstAidGuidance - The main function to trigger the first aid guidance flow.
 * - AiPoweredFirstAidGuidanceInput - The input type for the aiPoweredFirstAidGuidance function.
 * - AiPoweredFirstAidGuidanceOutput - The output type for the aiPoweredFirstAidGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPoweredFirstAidGuidanceInputSchema = z.object({
  keywords: z
    .string()
    .describe(
      'Emergency-related keywords or a description of the situation (e.g., chest pain, bleeding).'
    ),
});
export type AiPoweredFirstAidGuidanceInput = z.infer<typeof AiPoweredFirstAidGuidanceInputSchema>;

const AiPoweredFirstAidGuidanceOutputSchema = z.object({
  instructions: z
    .string()
    .describe(
      'Step-by-step first aid instructions based on the provided keywords.'
    ),
});
export type AiPoweredFirstAidGuidanceOutput = z.infer<typeof AiPoweredFirstAidGuidanceOutputSchema>;

export async function aiPoweredFirstAidGuidance(
  input: AiPoweredFirstAidGuidanceInput
): Promise<AiPoweredFirstAidGuidanceOutput> {
  return aiPoweredFirstAidGuidanceFlow(input);
}

const firstAidPrompt = ai.definePrompt({
  name: 'firstAidPrompt',
  input: {schema: AiPoweredFirstAidGuidanceInputSchema},
  output: {schema: AiPoweredFirstAidGuidanceOutputSchema},
  prompt: `You are an expert first aid responder. A user will provide keywords related to a medical emergency.
Your job is to provide clear, step-by-step first aid instructions.
Reason step by step about the best course of action, and decide when it is appropriate to include a piece of information.
Make sure the instructions are easy to understand and follow.

Keywords: {{{keywords}}}`,
});

const aiPoweredFirstAidGuidanceFlow = ai.defineFlow(
  {
    name: 'aiPoweredFirstAidGuidanceFlow',
    inputSchema: AiPoweredFirstAidGuidanceInputSchema,
    outputSchema: AiPoweredFirstAidGuidanceOutputSchema,
  },
  async input => {
    const {output} = await firstAidPrompt(input);
    return output!;
  }
);
