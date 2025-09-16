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
import { SupportedLanguageSchema } from '@/ai/schemas/text-to-speech';

const AiPoweredFirstAidGuidanceInputSchema = z.object({
  keywords: z
    .string()
    .describe(
      'Emergency-related keywords or a description of the situation (e.g., chest pain, bleeding).'
    ),
    language: SupportedLanguageSchema.describe('The language for the output instructions.'),
});
export type AiPoweredFirstAidGuidanceInput = z.infer<typeof AiPoweredFirstAidGuidanceInputSchema>;

const AiPoweredFirstAidGuidanceOutputSchema = z.object({
  instructions: z
    .string()
    .describe(
      'Step-by-step first aid instructions based on the provided keywords, formatted in Markdown.'
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
Your job is to provide clear, step-by-step first aid instructions formatted in simple Markdown.

- Use '##' for main section titles (e.g., '## Key Steps').
- Use '###' for step titles (e.g., '### Step 1: Check for Danger').
- Use plain text for the description of each step.
- Be clear, concise, and easy to understand.
- Always include a '## Disclaimer' section at the end, advising the user to call emergency services.

Translate all of your output into the following language: {{{language}}}.

Emergency Keywords: {{{keywords}}}`,
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
