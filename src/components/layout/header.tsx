import Link from 'next/link';
import { MessageSquareText, ShieldQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4 h-16">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground transition-colors hover:text-primary/80">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-headline">FirstStep</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" asChild>
            <Link href="/guides">
              <ShieldQuestion className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Guides</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/chat">
              <MessageSquareText className="mr-0 sm:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
