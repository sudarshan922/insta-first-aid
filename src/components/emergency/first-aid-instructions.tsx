'use client';

import { useState, useEffect, useRef } from 'react';
import {
  textToSpeech,
} from '@/ai/flows/text-to-speech';
import type { SupportedLanguage } from '@/ai/schemas/text-to-speech';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Pause, Play, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FirstAidInstructionsProps = {
  instructions: string;
  language: SupportedLanguage;
};

export function FirstAidInstructions({ instructions, language }: FirstAidInstructionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup audio on component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // When language or instructions change, stop playing audio and clear the audio source
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, [instructions, language]);


  const handlePlayPause = async () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    if (audioRef.current && audioRef.current.src) {
        audioRef.current.play();
        setIsPlaying(true)
        return;
    }

    setIsLoading(true);
    try {
      const result = await textToSpeech({
        text: instructions.replace(/#|(\*\*)/g, ''), // Remove markdown for cleaner speech
        language: language,
      });

      if (!audioRef.current) {
        audioRef.current = new Audio();
        audioRef.current.onended = () => setIsPlaying(false);
      }
      
      audioRef.current.src = result.audioDataUri;
      audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate audio. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formattedInstructions = instructions.split('\n').filter(line => line.trim().length > 0).map((line, index) => {
    if (line.startsWith('### ')) {
      return <h3 key={index} className="font-headline text-lg font-bold mt-4 mb-2">{line.substring(4)}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={index} className="font-headline text-xl font-bold mt-6 mb-3 border-b pb-2">{line.substring(3)}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="font-headline text-2xl font-bold mt-8 mb-4 border-b pb-3">{line.substring(2)}</h1>;
    }
     if (line.startsWith('* **') || line.startsWith('**')) {
      return <p key={index} className="font-bold my-2">{line.replace(/\*/g, '')}</p>;
    }
    return <p key={index} className="mb-2 text-base leading-relaxed">{line}</p>;
  });

  return (
    <Card className="mt-8 animate-in fade-in-50 duration-500 shadow-lg border-primary/20">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">First Aid Steps</CardTitle>
        <Button onClick={handlePlayPause} disabled={isLoading} size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="mr-2 h-5 w-5" />
          ) : (
            <Volume2 className="mr-2 h-5 w-5" />
          )}
          {isLoading ? 'Generating...' : isPlaying ? 'Pause Audio' : 'Read Aloud'}
        </Button>
      </CardHeader>
      <CardContent className="prose prose-lg max-w-none text-foreground space-y-4">
        {formattedInstructions}
      </CardContent>
    </Card>
  );
}
