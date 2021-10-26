import { IPrice } from "./oracle";

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
	token_id: string;
	supplied: { shares: string; string: string };
	borrowed: { shares: string; string: string };
	reserved: string;
	last_update_timestamp: string;
	config: IAssetConfig;
}

interface IPool {
	shares: string;
	balance: string;
}

export interface IMetadata {
	icon: string;
	name: string;
	symbol: string;
	decimals: number;
}

export interface IAssetDetailed {
	token_id: string;
	/// Total supplied including collateral, but excluding reserved.
	supplied: IPool;
	/// Total borrowed.
	borrowed: IPool;
	/// The amount reserved for the stability. This amount can also be borrowed and affects
	/// borrowing rate.
	reserved: string;
	/// When the asset was last updated. It's always going to be the current block timestamp.
	last_update_timestamp: string;
	/// The asset config.
	config: IAssetConfig;
	/// Current supply APR
	supply_apr: string;
	/// Current borrow APR
	borrow_apr: string;
	/// Asset farms
	farms: IAssetFarmView[];
	// meta data mixin
	metadata?: IMetadata;
	// price mixin
	price?: IPrice;
}

interface IAssetFarmView {
	farm_id: string;
	rewards: IAssetFarmReward[];
}

interface AssetFarm {
	block_timestamp: string;
	/// Rewards for the given farm
	rewards: IAssetFarmReward;
}

interface IAssetFarmReward {
	/// The reward token ID.
	token_id: string;
	/// The amount of reward distributed per day.
	reward_per_day: string;
	/// The log base for the booster. Used to compute boosted shares per account.
	/// Including decimals of the booster.
	booster_log_base: string;
	/// The amount of rewards remaining to distribute.
	remaining_rewards: string;
	/// The total number of boosted shares.
	boosted_shares: string;
}