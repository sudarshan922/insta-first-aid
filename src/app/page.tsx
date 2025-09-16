import { EmergencyForm } from '@/components/emergency/emergency-form';
import { EmergencyContacts } from '@/components/emergency/emergency-contacts';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-10 md:mb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
          First Aid, Instantly.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          In an emergency, every second counts. Describe the situation below, and our AI will provide immediate first aid instructions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-start">
        <div className="lg:col-span-7">
          <Card className="shadow-lg">
             <CardContent className="p-6 md:p-8">
                <h2 className="text-2xl font-bold font-headline mb-6">Describe the Emergency</h2>
                <EmergencyForm />
             </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-5">
           <div className="sticky top-24">
             <EmergencyContacts />
           </div>
        </div>
      </div>
    </div>
  );
}
