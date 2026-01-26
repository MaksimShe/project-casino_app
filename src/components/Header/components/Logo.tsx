import Image from 'next/image';
import logoIcon from '@/../public/logo/logo-header.svg';

export const Logo = () => {
  return (
    <div className="inline-flex h-full items-center gap-2">
      <span className="text-2xl font-black text-white">Blaze</span>
      <Image src={logoIcon} alt="logo" height={48} width={48} />
      <span className="text-2xl font-black text-white">Casino</span>
    </div>
  );
};
