import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Shield, Building, Flame } from 'lucide-react';

const emergencyContacts = [
  { name: 'Ambulance', number: '108', icon: <Phone /> },
  { name: 'National Emergency', number: '112', icon: <Shield /> },
  { name: 'Police', number: '100', icon: <Building /> },
  { name: 'Fire', number: '101', icon: <Flame /> },
];

export function EmergencyContacts() {
  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Quick Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {emergencyContacts.map((contact) => (
            <Button
              key={contact.name}
              variant="destructive"
              className="h-20 flex-col gap-1 text-base"
              asChild
            >
              <a href={`tel:${contact.number}`}>
                {contact.icon}
                <span>{contact.name}</span>
                <span className="text-sm opacity-80">{contact.number}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
