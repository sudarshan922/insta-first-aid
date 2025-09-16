'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { detectEmergencyKeywords } from '@/ai/flows/emergency-keyword-detection';
import { streamlinedFirstAid } from '@/ai/flows/streamlined-first-aid-flow';
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
import { Switch } from '@/components/ui/switch';
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
  autoPlayAudio: z.boolean(),
});

type EmergencyFormValues = z.infer<typeof emergencyFormSchema>;

type ResultState = {
  isEmergency: boolean;
  guidance?: StreamlinedFirstAidOutput;
  language: SupportedLanguage;
  autoPlay: boolean;
};

export function EmergencyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const { toast } = useToast();

  const form = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: {
      description: '',
      language: 'en-US',
      autoPlayAudio: true,
    },
  });

  async function onSubmit(data: EmergencyFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const emergencyResult = await detectEmergencyKeywords({ text: data.description });

      if (emergencyResult.isEmergency && emergencyResult.keywords.length > 0) {
        const guidanceResult = await streamlinedFirstAid({
          keywords: emergencyResult.keywords.join(', '),
          language: data.language,
        });
        setResult({
          isEmergency: true,
          guidance: guidanceResult,
          language: data.language,
          autoPlay: data.autoPlayAudio,
        });
      } else {
        setResult({ isEmergency: false, language: data.language, autoPlay: false });
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
            <FormField
              control={form.control}
              name="autoPlayAudio"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-6 sm:mt-0 shadow-sm bg-card h-12">
                  <FormLabel className="text-base">
                    Auto-play Audio
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
           <Button type="submit" size="lg" disabled={isLoading} className="w-full h-14 text-lg mt-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing & Generating...
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

      {result?.isEmergency && result.guidance && (
        <FirstAidInstructions
          instructions={result.guidance.instructions}
          audioDataUri={result.guidance.audioDataUri}
          language={result.language}
          autoPlay={result.autoPlay}
        />
      )}
    </div>
  );
}
