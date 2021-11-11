interface IFarmId {
  Supplied?: string;
  Borrowed?: string;
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

interface AccountFarmRewardView {
  asset_farm_reward: IAssetFarmReward;
  boosted_shares: "string";
  unclaimed_amount: "string";
}

interface IFarm {
  farm_id: IFarmId;
  rewards: AccountFarmRewardView[];
}
interface ICollateralAsset {
  token_id: string;
  shares: string;
}

interface IBorrowedAsset {
  token_id: string;
  shares: string;
}

export interface IAsset {
  token_id: string;
  balance: string;
  shares: string;
  apr: string;
}

export interface IAccount {
  /// A copy of an account ID. Saves one storage_read when iterating on accounts.
  account_id: string;
  /// A list of collateral assets.
  collateral: ICollateralAsset[];
  /// A list of borrowed assets.
  borrowed: IBorrowedAsset[];
}

export interface IAccountDetailed {
  account_id: string;
  /// A list of assets that are supplied by the account (but not used a collateral).
  supplied: IAsset[];
  /// A list of assets that are used as a collateral.
  collateral: IAsset[];
  /// A list of assets that are borrowed.
  borrowed: IAsset[];
  /// Account farms
  farms: IFarm[];
}

export interface IBalance {
  token_id: string;
  account_id: string;
  balance: number;
}
