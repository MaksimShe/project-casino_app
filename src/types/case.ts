import { type Rarity } from '@/components/CaseGame/constants';

// API Response Types (from backend_dock.md)
export interface CaseItem {
  id: string;
  name: string;
  rarity: Rarity;
  value: number;
  chance: number;
  imageUrl: string; // Backend sends imageUrl not image
}

export interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  items: CaseItem[];
}

export interface CasesResponse {
  cases: Case[];
}

export interface CaseDetailsResponse {
  id: string;
  name: string;
  price: number;
  items: CaseItem[];
}

export interface OpenCaseResponse {
  openingId: string;
  item: {
    id: string;
    name: string;
    rarity: string;
    image?: string; // For compatibility - some responses might use image
    imageUrl?: string; // Backend sends imageUrl
    value: number;
  };
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  roll: number;
  newBalance: number;
  casePrice: number;
  itemValue: number;
}

// UI State Types
export interface OpeningResult {
  item: CaseItem;
  profit: number;
  newBalance: number;
  proofData: {
    serverSeed: string;
    clientSeed: string;
    nonce: number;
    roll: number;
  };
}

export interface AnimationItem {
  id: string;
  name: string;
  imageUrl: string;
  rarity: string;
  value: number;
  isWinning?: boolean;
}
