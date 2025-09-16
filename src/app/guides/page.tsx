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
            <Card className="h-full transition-all duration-300 group-hover:border-primary group-hover:shadow-lg flex flex-col md:flex-row">
              <div className="relative w-full md:w-1/3 h-40 md:h-auto flex-shrink-0">
                  {guide.image && (
                    <Image
                      src={guide.image.imageUrl}
                      alt={guide.image.description}
                      fill
                      className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-r-none transition-transform duration-300 group-hover:scale-105"
                      data-ai-hint={guide.image.imageHint}
                    />
                  )}
              </div>
              <div className="flex flex-col flex-grow">
                <CardHeader className="flex-grow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-3">
                      <guide.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <CardTitle className="font-headline text-xl">{guide.title}</CardTitle>
                        <CardDescription className="pt-2">{guide.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <div className="p-6 pt-0 mt-auto self-end">
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
