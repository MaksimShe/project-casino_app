// API Response Types (from backend_dock.md)
export interface CaseItem {
  id: string;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  value: number;
  chance: number;
}

export interface Case {
  id: string;
  name: string;
  price: number;
  image: string; // Unused initially
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
    image: string; // emoji from backend
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
  item: CaseItem & { image: string }; // emoji
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
  emoji: string;
  rarity: string;
  value: number;
  isWinning?: boolean;
}
