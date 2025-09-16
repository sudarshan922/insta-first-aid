import { EmergencyForm } from '@/components/emergency/emergency-form';
import { EmergencyContacts } from '@/components/emergency/emergency-contacts';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold font-headline mb-2 text-primary">
          Instant First Aid Guidance
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          In an emergency, every second counts. Describe the situation, and FirstStep will provide immediate, AI-powered first aid instructions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-bold font-headline mb-4">Describe the Emergency</h2>
          <EmergencyForm />
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
