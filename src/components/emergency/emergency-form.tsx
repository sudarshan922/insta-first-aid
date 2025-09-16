'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { detectEmergencyKeywords } from '@/ai/flows/emergency-keyword-detection';
import { aiPoweredFirstAidGuidance } from '@/ai/flows/ai-powered-first-aid-guidance';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import type { StreamlinedFirstAidOutput } from '@/ai/schemas/streamlined-first-aid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { FirstAidInstructions } from './first-aid-instructions';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SupportedLanguage } from '@/ai/schemas/text-to-speech';
import { SupportedLanguageSchema } from '@/ai/schemas/text-to-speech';

const languages: { value: SupportedLanguage; label: string }[] = [
  { value: 'en-US', label: 'English' },
  { value: 'hi-IN', label: 'Hindi' },
];

const emergencyFormSchema = z.object({
  description: z.string().min(10, {
    message: 'Please describe the situation in at least 10 characters.',
  }),
  language: SupportedLanguageSchema,
});

type EmergencyFormValues = z.infer<typeof emergencyFormSchema>;

type ResultState = {
  isEmergency: boolean;
  instructions?: string;
  language: SupportedLanguage;
};

export function EmergencyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: {
      description: '',
      language: 'en-US',
    },
  });

  async function onSubmit(data: EmergencyFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setAudioDataUri(null);
    setIsAudioLoading(false);

    try {
      const emergencyResult = await detectEmergencyKeywords({ text: data.description });

      if (emergencyResult.isEmergency && emergencyResult.keywords.length > 0) {
        // First, get the text guidance
        const guidanceResult = await aiPoweredFirstAidGuidance({
          keywords: emergencyResult.keywords.join(', '),
          language: data.language,
        });

        setResult({
          isEmergency: true,
          instructions: guidanceResult.instructions,
          language: data.language,
        });
        setIsAudioLoading(true);

        // Then, generate audio in the background
        textToSpeech({
          text: guidanceResult.instructions.replace(/#|\*/g, ''),
          language: data.language,
        })
          .then((speechResult) => {
            setAudioDataUri(speechResult.audioDataUri);
          })
          .catch((e) => {
            console.error('Audio generation failed:', e);
            // Don't show a toast for this, as it's a non-critical background task
          })
          .finally(() => {
            setIsAudioLoading(false);
          });
      } else {
        setResult({ isEmergency: false, language: data.language });
      }
    } catch (e) {
      console.error(e);
      setError('An unexpected error occurred. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get first aid guidance. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                 <FormLabel className="text-base">Emergency Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'A person has collapsed and is not breathing' or 'Severe burn on the arm'"
                    className="min-h-[140px] text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
             <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                   <FormLabel className="text-base">Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger className="w-full text-base h-12">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="text-base">
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <Button type="submit" size="lg" disabled={isLoading} className="w-full h-14 text-lg mt-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing
                </>
              ) : (
                'Get First Aid Steps'
              )}
            </Button>
        </form>
      </Form>

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && !result.isEmergency && (
        <Alert className="mt-6">
          <AlertTitle>Not an Emergency</AlertTitle>
          <AlertDescription>
            Based on the description, this may not be a critical emergency. However, if you are unsure, please contact a medical professional or an emergency service immediately. You can also try our AI Chat for more general questions.
          </AlertDescription>
        </Alert>
      )}

      {result?.isEmergency && result.instructions && (
        <FirstAidInstructions
          instructions={result.instructions}
          audioDataUri={audioDataUri}
          isAudioLoading={isAudioLoading}
        />
      )}
    </div>
  );
}
