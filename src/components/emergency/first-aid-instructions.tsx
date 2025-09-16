'use client';

import { useState, useEffect, useRef } from 'react';
import {
  textToSpeech,
  SupportedLanguage,
} from '@/ai/flows/text-to-speech';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Pause, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FirstAidInstructionsProps = {
  instructions: string;
};

const languages: { value: SupportedLanguage; label: string }[] = [
  { value: 'en-US', label: 'English' },
  { value: 'hi-IN', label: 'Hindi' },
  { value: 'mr-IN', label: 'Marathi' },
  { value: 'kn-IN', label: 'Kannada' },
  { value: 'kok-IN', label: 'Konkani' },
];

export function FirstAidInstructions({ instructions }: FirstAidInstructionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>('en-US');
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
        text: instructions.replace(/\*/g, ''),
        language: selectedLanguage,
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
      <CardFooter className="flex flex-wrap items-center gap-4">
        <Button onClick={handlePlayPause} disabled={isLoading} className="w-32">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="mr-2" />
          ) : (
            <Play className="mr-2" />
          )}
          {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Read Aloud'}
        </Button>
        <Select
          onValueChange={(value) => {
            if (isPlaying) {
              audioRef.current?.pause();
              setIsPlaying(false);
            }
            audioRef.current = null;
            setSelectedLanguage(value as SupportedLanguage)
          }}
          defaultValue={selectedLanguage}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  );
}
