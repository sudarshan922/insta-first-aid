import { z } from 'zod';
import { SupportedLanguageSchema } from '@/ai/schemas/text-to-speech';

export const StreamlinedFirstAidInputSchema = z.object({
  keywords: z.string().describe('Emergency-related keywords.'),
  language: SupportedLanguageSchema.describe('The language for the output.'),
});
export type StreamlinedFirstAidInput = z.infer<
  typeof StreamlinedFirstAidInputSchema
>;

export const StreamlinedFirstAidOutputSchema = z.object({
  instructions: z
    .string()
    .describe('Step-by-step first aid instructions in Markdown.'),
  audioDataUri: z
    .string()
    .describe("The generated audio as a data URI."),
});
export type StreamlinedFirstAidOutput = z.infer<
  typeof StreamlinedFirstAidOutputSchema
>;
