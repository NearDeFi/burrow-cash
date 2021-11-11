export interface IPrice {
  decimals: number;
  multiplier: string;
  usd: number;
}

export interface IAssetPrice {
  asset_id: string;
  price: IPrice | null;
}

export interface IPrices {
  prices: IAssetPrice[];
  recency_duration_sec: number;
  timestamp: string;
}
