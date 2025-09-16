'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

type FirstAidInstructionsProps = {
  instructions: string;
};

export function FirstAidInstructions({ instructions }: FirstAidInstructionsProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleSpeak = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Sorry, your browser does not support text-to-speech.');
      return;
    }
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(instructions.replace(/\*/g, ''));
      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setIsPaused(false);
      }
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      setIsPaused(false);
    }
  }, [instructions, isSpeaking, isPaused]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    // Cleanup speech synthesis on component unmount
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formattedInstructions = instructions.split('\n').map((line, index) => {
    if (line.startsWith('* **') || line.startsWith('**')) {
      return <p key={index} className="font-bold my-2">{line.replace(/\*/g, '')}</p>;
    }
    if (line.trim().length > 0) {
      return <p key={index} className="mb-2">{line}</p>;
    }
    return null;
  });

  return (
    <Card className="mt-6 animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">First Aid Steps</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none text-foreground">
        {formattedInstructions}
      </CardContent>
      <CardFooter className="flex items-center gap-2">
         <Button onClick={handleSpeak}>
            {isSpeaking && !isPaused ? <Pause className="mr-2" /> : <Play className="mr-2" />}
            {isSpeaking && !isPaused ? 'Pause' : (isPaused ? 'Resume' : 'Read Aloud')}
          </Button>
        {isSpeaking && (
           <Button onClick={handleStop} variant="outline">
            <VolumeX className="mr-2" />
            Stop
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
