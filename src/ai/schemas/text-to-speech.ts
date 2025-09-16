import { z } from 'zod';

export const SupportedLanguageSchema = z.enum([
  'en-US', // English
  'hi-IN', // Hindi
]);
export type SupportedLanguage = z.infer<typeof SupportedLanguageSchema>;

export const TextToSpeechInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  language: SupportedLanguageSchema.describe(
    'The language of the text. Supported languages: en-US, hi-IN'
  ),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

export const TextToSpeechOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'"
    ),
});
export type TextToSpeechOutput = z.infer<typeof TextToSpeechOutputSchema>;
