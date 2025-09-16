'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { detectEmergencyKeywords } from '@/ai/flows/emergency-keyword-detection';
import { aiPoweredFirstAidGuidance } from '@/ai/flows/ai-powered-first-aid-guidance';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { FirstAidInstructions } from './first-aid-instructions';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const emergencyFormSchema = z.object({
  description: z.string().min(10, {
    message: 'Please describe the situation in at least 10 characters.',
  }),
});

type EmergencyFormValues = z.infer<typeof emergencyFormSchema>;

export function EmergencyForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ isEmergency: boolean; instructions?: string } | null>(null);
  const { toast } = useToast();

  const form = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencyFormSchema),
    defaultValues: {
      description: '',
    },
  });

  async function onSubmit(data: EmergencyFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const emergencyResult = await detectEmergencyKeywords({ text: data.description });

      if (emergencyResult.isEmergency && emergencyResult.keywords.length > 0) {
        const guidanceResult = await aiPoweredFirstAidGuidance({
          keywords: emergencyResult.keywords.join(', '),
        });
        setResult({ isEmergency: true, instructions: guidanceResult.instructions });
      } else {
        setResult({ isEmergency: false });
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="e.g., 'A person has collapsed and is not breathing' or 'Severe burn on the arm'"
                    className="min-h-[120px] text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
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
        <FirstAidInstructions instructions={result.instructions} />
      )}
    </div>
  );
}
