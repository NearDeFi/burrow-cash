import { IBoosterStaking } from "../interfaces/account";

interface Balance {
  [tokenId: string]: string;
}

interface PortfolioAsset {
  apr: string;
  balance: string;
  shares: string;
}

export interface FarmData {
  boosted_shares: string;
  unclaimed_amount: string;
  asset_farm_reward: {
    reward_per_day: string;
    booster_log_base: string;
    remaining_rewards: string;
    boosted_shares: string;
  };
}

export interface Farm {
  [reward_token_id: string]: FarmData;
}

export interface Portfolio {
  supplied: {
    [tokenId: string]: PortfolioAsset;
  };
  collateral: {
    [tokenId: string]: PortfolioAsset;
  };
  borrowed: {
    [tokenId: string]: PortfolioAsset;
  };
  farms: {
    supplied: {
      [tokenId: string]: Farm;
    };
    borrowed: {
      [tokenId: string]: Farm;
    };
  };
  staking: IBoosterStaking;
  hasNonFarmedAssets: boolean;
}

type Status = "pending" | "fulfilled" | "rejected" | undefined;
export interface AccountState {
  accountId: string;
  balances: Balance;
  portfolio: Portfolio;
  status: Status;
  fetchedAt: string | undefined;
  isClaiming: Status;
}

export const initialStaking = {
  staked_booster_amount: "0",
  unlock_timestamp: "0",
  x_booster_amount: "0",
};

export const initialState: AccountState = {
  accountId: "",
  balances: {},
  portfolio: {
    supplied: {},
    collateral: {},
    borrowed: {},
    farms: {
      supplied: {},
      borrowed: {},
    },
    staking: initialStaking,
    hasNonFarmedAssets: false,
  },
  status: undefined,
  isClaiming: undefined,
  fetchedAt: undefined,
};
