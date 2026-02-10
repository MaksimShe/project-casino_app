'use client';

import { memo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { formatNumber } from '@/utils/format';
import type { Case } from '@/types/case';
import caseImage from '@/../public/cases-game/case-img.png';
import { Stars } from '@/components/CaseGame/components/Stars';
import coinImg from '@/../public/leaderboard_icons/dollar.svg';
import { mockDescription } from '@/components/CaseGame/helpers/mockDescription';
import { getCaseName } from '@/components/CaseGame/helpers/getCaseName';
import { useTranslation } from '@/i18n/useTranslation';

interface CaseCardProps {
  caseItem: Case;
  index: number;
}

export const CaseCard = memo(({ caseItem, index }: CaseCardProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <motion.div
      key={caseItem.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => router.push(`/cases-game/${caseItem.id}`)}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-[#423E6980] transition-all hover:shadow-[0_0_16px_0_#FFFFFF80]"
    >
      <div className="relative flex flex-col items-center justify-center gap-2 p-6">
        <Stars starsCount={index + 1} />
        <p className="mt-2 p-0 text-xl font-bold text-white max-lg:text-center lg:text-3xl">
          {getCaseName(caseItem.name, t)}
        </p>
        <div className="flex gap-1 rounded-full border border-amber-300 px-3.5 py-1.5 font-bold text-white">
          {formatNumber(caseItem.price)}
          <Image src={coinImg} alt="coin" width={16} height={16} />
        </div>
        <div className="mt-2 text-6xl transition-transform group-hover:scale-103 sm:mt-8">
          <Image src={caseImage} alt="case" height={180} width={260} />
        </div>
      </div>

      {/* Case Info */}
      <div className="px-6 py-2 sm:py-6 sm:pb-16">
        <p className="mb-2 text-white max-sm:text-xs">
          {mockDescription(caseItem.name, t)}
        </p>
      </div>
    </motion.div>
  );
});
