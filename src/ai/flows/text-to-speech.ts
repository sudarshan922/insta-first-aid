'use server';
/**
 * @fileOverview This file defines a Genkit flow for converting text to speech in multiple languages.
 *
 * - textToSpeech - The main function to trigger the text-to-speech flow.
 * - TextToSpeechInput - The input type for the textToSpeech function.
 * - TextToSpeechOutput - The output type for the textToSpeech function.
 */

import { ai } from '@/ai/genkit';
import wav from 'wav';
import {
  TextToSpeechInputSchema,
  TextToSpeechOutputSchema,
  type TextToSpeechInput,
  type TextToSpeechOutput,
  type SupportedLanguage,
} from '@/ai/schemas/text-to-speech';

export type { TextToSpeechInput, TextToSpeechOutput, SupportedLanguage };

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  return textToSpeechFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async (input) => {
    // Select a voice based on the language
    const voiceName = 'Algenib';

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: voiceName,
            },
          },
        },
      },
      prompt: input.text,
    });

    if (!media) {
      throw new Error('No audio was generated.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);
    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
