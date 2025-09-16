import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Shield, Building, Flame } from 'lucide-react';

const emergencyContacts = [
  { name: 'Ambulance', number: '108', icon: <Phone className="h-6 w-6" /> },
  { name: 'National Emergency', number: '112', icon: <Shield className="h-6 w-6" /> },
  { name: 'Police', number: '100', icon: <Building className="h-6 w-6" /> },
  { name: 'Fire', number: '101', icon: <Flame className="h-6 w-6" /> },
];

export function EmergencyContacts() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Quick Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          For critical emergencies, call one of these numbers directly.
        </p>
        <div className="grid grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => (
            <Button
              key={contact.name}
              variant="outline"
              className="h-24 flex-col justify-center items-center gap-1 p-2 text-base font-semibold border-2 hover:bg-destructive/5 hover:border-destructive text-center"
              asChild
            >
              <a href={`tel:${contact.number}`}>
                {contact.icon}
                <span className="text-sm sm:text-base leading-tight">{contact.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{contact.number}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
