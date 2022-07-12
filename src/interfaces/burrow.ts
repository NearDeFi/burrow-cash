import { Account, Contract } from "near-api-js";
import NearWalletSelector from "@near-wallet-selector/core";

import { IPrices } from "./oracle";
import { IMetadata, AssetEntry, IAssetDetailed, Balance, NetTvlFarm } from "./asset";
import { IAccount, IAccountDetailed } from "./account";

export interface IConfig {
  booster_decimals: number;
  booster_token_id: string;
  force_closing_enabled: number;
  max_num_assets: number;
  maximum_recency_duration_sec: number;
  maximum_staking_duration_sec: number;
  maximum_staleness_duration_sec: number;
  minimum_staking_duration_sec: number;
  oracle_account_id: string;
  owner_id: string;
  x_booster_multiplier_at_maximum_staking_duration: number;
}

export interface IBurrow {
  selector: NearWalletSelector;
  account: Account;
  changeAccount: (accountId: string) => void;
  fetchData: () => void;
  hideModal: () => void;
  signOut: () => void;
  logicContract: Contract;
  oracleContract: Contract;
  config: IConfig;
  view: (
    contract: Contract,
    methodName: string,
    args?: any,
  ) => Promise<
    | IPrices
    | IMetadata
    | AssetEntry[]
    | IAssetDetailed
    | IAccountDetailed
    | IAccount[]
    | Balance
    | IConfig
    | NetTvlFarm
    | string
  >;
  call: (
    contract: Contract,
    methodName: string,
    args?: Record<string, unknown>,
    deposit?: string,
  ) => Promise<any>;
}
