'use client';

import { useState, useEffect, useRef } from 'react';
import type { SupportedLanguage } from '@/ai/schemas/text-to-speech';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pause, Play, Volume2 } from 'lucide-react';

type FirstAidInstructionsProps = {
  instructions: string;
  audioDataUri: string;
  language: SupportedLanguage;
  autoPlay: boolean;
};

export function FirstAidInstructions({
  instructions,
  audioDataUri,
  language,
  autoPlay,
}: FirstAidInstructionsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsPlaying(false);
    }
    
    const audio = audioRef.current;
    
    // Update the source if it has changed
    if (audio.src !== audioDataUri) {
        audio.src = audioDataUri;
    }

    // Handle autoPlay
    if (autoPlay) {
      // We only want to play if it's not already playing due to a previous render
      if (audio.paused) {
         audio.play().catch(console.error); // Autoplay can be blocked
         setIsPlaying(true);
      }
    } else {
        // If autoPlay is false, make sure it's paused.
        if (!audio.paused) {
            audio.pause();
            setIsPlaying(false);
        }
    }

    // Cleanup on unmount
    return () => {
      audio.pause();
      setIsPlaying(false);
    };
  // We only want to re-run this logic if these specific props change.
  // We've removed instructions and language as they don't directly control audio playback.
  }, [audioDataUri, autoPlay]);


  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Ensure src is set before playing, especially on first manual play
      if(audioRef.current && audioRef.current.src !== audioDataUri) {
        audioRef.current.src = audioDataUri;
      }
      audioRef.current?.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const formattedInstructions = instructions
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line, index) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="font-headline text-lg font-bold mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2
            key={index}
            className="font-headline text-xl font-bold mt-6 mb-3 border-b pb-2"
          >
            {line.substring(3)}
          </h2>
        );
      }
      if (line.startsWith('# ')) {
        return (
          <h1
            key={index}
            className="font-headline text-2xl font-bold mt-8 mb-4 border-b pb-3"
          >
            {line.substring(2)}
          </h1>
        );
      }
      if (line.startsWith('* **') || line.startsWith('**')) {
        return (
          <p key={index} className="font-bold my-2">
            {line.replace(/\*/g, '')}
          </p>
        );
      }
      return (
        <p key={index} className="mb-2 text-base leading-relaxed">
          {line}
        </p>
      );
    });

  return (
    <Card className="mt-8 animate-in fade-in-50 duration-500 shadow-lg border-primary/20">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">First Aid Steps</CardTitle>
        <Button onClick={handlePlayPause} size="lg">
          {isPlaying ? (
            <Pause className="mr-2 h-5 w-5" />
          ) : (
            <Volume2 className="mr-2 h-5 w-5" />
          )}
          {isPlaying ? 'Pause Audio' : 'Play Audio'}
        </Button>
      </CardHeader>
      <CardContent className="prose prose-lg max-w-none text-foreground space-y-4">
        {formattedInstructions}
      </CardContent>
    </Card>
  );
}
