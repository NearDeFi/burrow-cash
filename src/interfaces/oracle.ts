export interface IPrice {
	decimals: number;
	multiplier: string;
}

export interface IAssetPrice {
	asset_id: string;
	price: IPrice;
}

export interface IPrices {
	prices: IAssetPrice[];
	recency_duration_sec: number;
	timestamp: string;
}
