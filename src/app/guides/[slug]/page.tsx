import { guides } from '@/data/guides';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

type GuidePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps) {
  const guide = guides.find((g) => g.slug === params.slug);

  if (!guide) {
    return {
      title: 'Guide Not Found',
    };
  }

  return {
    title: `${guide.title} - FirstStep Guide`,
    description: guide.description,
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = guides.find((g) => g.slug === params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <guide.icon className="h-12 w-12 text-primary flex-shrink-0" />
        <div>
          <h1 className="text-3xl md:text-5xl font-bold font-headline">{guide.title}</h1>
          <p className="text-lg text-muted-foreground mt-1">{guide.description}</p>
        </div>
      </div>
      
      {guide.image && (
        <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={guide.image.imageUrl}
            alt={guide.image.description}
            width={1200}
            height={400}
            className="w-full h-auto max-h-[400px] object-cover"
            data-ai-hint={guide.image.imageHint}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Step-by-Step Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {guide.steps.map((step, index) => (
              <div key={index}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 bg-primary text-primary-foreground h-8 w-8 rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg font-headline">{step.title}</h3>
                    <p className="text-muted-foreground mt-1">{step.description}</p>
                  </div>
                </div>
                {index < guide.steps.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
