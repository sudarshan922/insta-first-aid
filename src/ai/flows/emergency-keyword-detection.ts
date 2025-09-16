'use server';

/**
 * @fileOverview Emergency keyword detection flow.
 *
 * - detectEmergencyKeywords - Detects emergency-related keywords from user input.
 * - DetectEmergencyKeywordsInput - The input type for the detectEmergencyKeywords function.
 * - DetectEmergencyKeywordsOutput - The return type for the detectEmergencyKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmergencyKeywordsInputSchema = z.object({
  text: z.string().describe('The text input from the user.'),
});
export type DetectEmergencyKeywordsInput = z.infer<typeof DetectEmergencyKeywordsInputSchema>;

const DetectEmergencyKeywordsOutputSchema = z.object({
  isEmergency: z.boolean().describe('Whether the input text indicates an emergency.'),
  keywords: z.array(z.string()).describe('The emergency-related keywords detected in the text.'),
});
export type DetectEmergencyKeywordsOutput = z.infer<typeof DetectEmergencyKeywordsOutputSchema>;

export async function detectEmergencyKeywords(input: DetectEmergencyKeywordsInput): Promise<DetectEmergencyKeywordsOutput> {
  return detectEmergencyKeywordsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEmergencyKeywordsPrompt',
  input: {schema: DetectEmergencyKeywordsInputSchema},
  output: {schema: DetectEmergencyKeywordsOutputSchema},
  prompt: `You are an AI assistant designed to detect emergency-related keywords in user input.

  Determine if the input text indicates an emergency situation. If it does, extract the relevant keywords.

  Example 1:
  Input: "I'm experiencing severe chest pain and difficulty breathing."
  Output: {
    "isEmergency": true,
    "keywords": ["chest pain", "difficulty breathing"]
  }

  Example 2:
  Input: "I have a headache and a slight fever."
  Output: {
    "isEmergency": false,
    "keywords": []
  }

  Input: {{{text}}}
  Output:`, // Keep the `Output:` at the end to tell the LLM what format to use.
});

const detectEmergencyKeywordsFlow = ai.defineFlow(
  {
    name: 'detectEmergencyKeywordsFlow',
    inputSchema: DetectEmergencyKeywordsInputSchema,
    outputSchema: DetectEmergencyKeywordsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
