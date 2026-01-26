import Image from 'next/image';
import crashBg from '@/../public/crash-game/bacground.png';
import { StarsCanvas } from '@/components/CrashGame/components/StarsCanvas';
import { PlanetsCanvas } from '@/components/CrashGame/components/PlanetsCanvas';

export const CrashBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl">
      <Image src={crashBg} alt="cosmos" fill className="object-cover" />
      <StarsCanvas />
      <PlanetsCanvas />
    </div>
  );
};
