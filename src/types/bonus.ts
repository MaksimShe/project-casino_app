export interface BonusStatusResponse {
  nextClaimAt: string;
  amount: number;
  baseAmount: number;
  wagerBonus: number;
  gamesBonus: number;
}

export interface BonusClaimResponse {
  amount: number;
  balance: number;
  nextClaimAt: string;
}
