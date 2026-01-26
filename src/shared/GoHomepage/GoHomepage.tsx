import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import Image from 'next/image';
import backArrorIcon from '@/../public/logo/back-arrow.svg';

export const GoHomepage = () => (
  <div className="mt-5 ml-6 max-lg:mt-2">
    <Link
      href={ROUTES.HOMEPAGE}
      className="flex gap-2 bg-gradient-to-b from-[#FFCD71] to-[#E59603] bg-clip-text text-transparent"
    >
      <Image src={backArrorIcon} alt="go back" height={24} width={24} />
      All Games
    </Link>
  </div>
);
