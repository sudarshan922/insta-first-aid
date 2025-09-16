import { type LucideIcon, HeartPulse, Flame, AlertTriangle, Droplets } from 'lucide-react';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export type Guide = {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  image: ImagePlaceholder | undefined;
  steps: { title: string; description: string }[];
};

export const guides: Guide[] = [
  {
    slug: 'cpr',
    title: 'Cardiopulmonary Resuscitation (CPR)',
    description: 'For an adult who is unresponsive and not breathing normally.',
    icon: HeartPulse,
    image: PlaceHolderImages.find(img => img.id === 'cpr-guide'),
    steps: [
        {
            title: "1. Check for Danger",
            description: "Ensure the area is safe for you and the person. Check for traffic, fire, or other hazards."
        },
        {
            title: "2. Check for Response",
            description: "Tap the person's shoulders and shout, 'Are you okay?'. Check for normal breathing for no more than 10 seconds."
        },
        {
            title: "3. Call for Help",
            description: "If there is no response, call your local emergency number immediately. Use a speakerphone if possible so you can start CPR."
        },
        {
            title: "4. Start Chest Compressions",
            description: "Place the heel of one hand in the center of the chest. Place your other hand on top. Push hard and fast at a rate of 100-120 compressions per minute. The chest should be compressed by about 5-6 cm."
        },
        {
            title: "5. Give Rescue Breaths (if trained)",
            description: "After 30 compressions, give 2 rescue breaths. Tilt the head back, lift the chin, pinch the nose, and give two breaths, each lasting about 1 second. Watch for the chest to rise."
        },
        {
            title: "6. Continue CPR",
            description: "Continue cycles of 30 compressions and 2 breaths until help arrives or the person starts to breathe normally."
        }
    ]
  },
  {
    slug: 'burns',
    title: 'Treating Burns',
    description: 'First aid for minor to moderate thermal burns.',
    icon: Flame,
    image: PlaceHolderImages.find(img => img.id === 'burns-guide'),
    steps: [
        {
            title: "1. Stop the Burning",
            description: "Remove the person from the source of the burn. If clothing is on fire, smother the flames."
        },
        {
            title: "2. Cool the Burn",
            description: "Immediately cool the burn with cool (not cold) running water for at least 20 minutes. Do not use ice, iced water, or any creams or greasy substances."
        },
        {
            title: "3. Remove Clothing and Jewelry",
            description: "Gently remove any clothing or jewelry near the burnt area of skin, but do not remove anything that's stuck to the skin."
        },
        {
            title: "4. Cover the Burn",
            description: "Cover the burn with a layer of cling film or a clean plastic bag. A sterile, non-fluffy dressing can also be used."
        },
        {
            title: "5. Seek Medical Help",
            description: "For any burn larger than the person's hand, any deep burn, or any burn on the face, hands, or feet, seek immediate medical attention."
        }
    ]
  },
  {
    slug: 'choking',
    title: 'Choking (Adult)',
    description: 'Assisting an adult who is choking and conscious.',
    icon: AlertTriangle,
    image: PlaceHolderImages.find(img => img.id === 'choking-guide'),
    steps: [
        {
            title: "1. Encourage Coughing",
            description: "If the person can breathe, speak, or cough, encourage them to keep coughing to clear the blockage."
        },
        {
            title: "2. Give Back Blows",
            description: "If coughing doesn't work, stand behind them and slightly to one side. Support their chest with one hand. Lean them forward and give up to 5 sharp blows between their shoulder blades with the heel of your hand."
        },
        {
            title: "3. Give Abdominal Thrusts",
            description: "If back blows fail, perform up to 5 abdominal thrusts (Heimlich maneuver). Stand behind the person, place your arms around their waist, and clench one fist. Place it just above their belly button. Grasp your fist with your other hand and pull sharply inwards and upwards."
        },
        {
            title: "4. Call for Help",
            description: "If the blockage is not cleared after 3 cycles of back blows and abdominal thrusts, call for an ambulance. Continue the cycles until help arrives."
        }
    ]
  },
   {
    slug: 'bleeding',
    title: 'Severe Bleeding',
    description: 'How to control severe external bleeding.',
    icon: Droplets,
    image: PlaceHolderImages.find(img => img.id === 'bleeding-guide'),
    steps: [
        {
            title: "1. Call for Help",
            description: "Call your local emergency number as soon as possible."
        },
        {
            title: "2. Apply Pressure",
            description: "Apply firm, direct pressure to the wound using a clean cloth, bandage, or your hands. If you have disposable gloves, wear them."
        },
        {
            title: "3. Elevate the Wound",
            description: "If the wound is on a limb, raise it above the level of the heart to help reduce blood flow."
        },
        {
            title: "4. Apply a Dressing",
            description: "If you have a sterile dressing or bandage, apply it tightly over the wound to maintain pressure. If blood soaks through, do not remove the original dressing; add another one on top."
        },
        {
            title: "5. Keep the Person Warm",
            description: "Lay the person down and cover them with a blanket to prevent heat loss and shock. Do not give them anything to eat or drink."
        }
    ]
  }
];
