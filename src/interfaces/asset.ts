interface IAssetConfig {
	reserve_ratio: number;
	target_utilization: number;
	target_utilization_rate: string;
	max_utilization_rate: string;
	volatility_ratio: number;
	extra_decimals: number;
	can_deposit: boolean;
	can_withdraw: boolean;
	can_use_as_collateral: boolean;
	can_borrow: boolean;
}

export interface IAsset {
	name: string;
	supplied: { shares: string; balance: string };
	borrowed: { shares: string; balance: string };
	reserved: string;
	last_update_timestamp: string;
	config: IAssetConfig;
}
