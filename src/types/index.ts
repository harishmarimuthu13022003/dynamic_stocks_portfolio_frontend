export interface Stock {
  _id?: string;
  symbol: string;
  name: string;
  purchasePrice: number;
  quantity: number;
  sector: string;
  exchange: 'NSE' | 'BSE';
  cmp?: number | null;
  peRatio?: string;
  latestEarnings?: string;
}

export interface PortfolioSummary {
  totalInvestment: number;
  currentValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
}

export interface SectorSummary {
  sector: string;
  investment: number;
  currentValue: number;
  gainLoss: number;
}
