export interface PrizeTier {
  rank: number;
  totalAmount: number;
  winnerCount: number;
  perAmount: number;
}

export interface LottoRound {
  roundNo: number;
  drawDate: string;
  numbers: number[];
  bonusNo: number;
  totalSalesAmount: number;
  firstPrizeAmount: number;
  firstPrizeWinners: number;
  prizes: PrizeTier[];
}

export interface NumberStat {
  number: number;
  frequency: number;
  lastAppeared: number;
  avgInterval: number;
}

export interface DhlotteryApiResponse {
  returnValue: string;
  drwNo: number;
  drwNoDate: string;
  drwtNo1: number;
  drwtNo2: number;
  drwtNo3: number;
  drwtNo4: number;
  drwtNo5: number;
  drwtNo6: number;
  bnusNo: number;
  firstPrzwnerCo: number;
  firstWinamnt: number;
  totSellamnt: number;
  firstAccumamnt: number;
  prizes?: PrizeTier[];
}
