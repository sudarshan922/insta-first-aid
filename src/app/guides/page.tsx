import { guides } from '@/data/guides';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
  title: 'First Aid Guides - FirstStep',
  description: 'Access essential first aid guides for common emergencies.',
};

export default function GuidesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-2">First Aid Guides</h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          Step-by-step instructions for common emergencies. Available anytime, even offline.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guides.map((guide) => (
          <Link href={`/guides/${guide.slug}`} key={guide.slug} className="group">
            <Card className="h-full transition-all duration-300 group-hover:border-primary group-hover:shadow-lg">
              <div className="grid md:grid-cols-3">
                 <div className="md:col-span-1 h-40 md:h-full relative overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                    {guide.image && (
                      <Image
                        src={guide.image.imageUrl}
                        alt={guide.image.description}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={guide.image.imageHint}
                      />
                    )}
                 </div>
                 <div className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <guide.icon className="h-8 w-8 text-primary" />
                        <CardTitle className="font-headline text-xl">{guide.title}</CardTitle>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <CardDescription className="pt-2">{guide.description}</CardDescription>
                  </CardHeader>
                 </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
