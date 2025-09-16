'use server';

/**
 * @fileOverview This file defines the AI chat interface flow for the FirstStep application.
 *
 * - aiChat - A function that handles the AI chat process.
 * - AIChatInput - The input type for the aiChat function.
 * - AIChatOutput - The return type for the aiChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIChatInputSchema = z.object({
  query: z.string().describe('The user query about first aid.'),
});
export type AIChatInput = z.infer<typeof AIChatInputSchema>;

const AIChatOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response to the user query.'),
});
export type AIChatOutput = z.infer<typeof AIChatOutputSchema>;

export async function aiChat(input: AIChatInput): Promise<AIChatOutput> {
  return aiChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiChatPrompt',
  input: {schema: AIChatInputSchema},
  output: {schema: AIChatOutputSchema},
  prompt: `You are a helpful AI assistant specializing in first aid. A user will ask a question about first aid, and you should provide a clear, concise, and helpful response. 

User Query: {{{query}}}`,
});

const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AIChatInputSchema,
    outputSchema: AIChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
